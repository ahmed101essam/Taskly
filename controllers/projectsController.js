const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { PrismaClient } = require("@prisma/client");
const Email = require("../utils/email");
const prisma = new PrismaClient();

exports.getAllMembers = catchAsync(async (req, res, next) => {
  const members = await prisma.projectMember.findMany({
    where: {
      projectId: req.project.id,
      active: true,
    },
    select: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          photo: true,
        },
      },
    },
  });
  res.status(200).json({
    data: { members },
  });
});
exports.addProject = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Validate required fields
  if (!req.body.name || !req.body.description) {
    return next(new AppError("Project name and description are required", 400));
  }

  // Check if a project with the same name exists for the user
  const existingProject = await prisma.project.findFirst({
    where: {
      name: req.body.name,
      active: true,
      managerId: user.id, // Fixed: use findFirst instead of findUnique
    },
  });

  if (existingProject) {
    return next(
      new AppError("You already have a project with the same name", 409)
    );
  }

  // Create the new project
  const newProject = await prisma.project.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      photo: req.body.photo || null, // If no image, store as null
      managerId: user.id,
    },
  });

  await prisma.projectMember.create({
    data: {
      userId: user.id,
      projectId: newProject.id,
      role: "MANAGER",
      memberStatus: "JOINED",
      joinedAt: newProject.createdAt,
    },
  });

  res.status(201).json({
    // Changed status to 201 (Created)
    status: "success",
    data: { project: newProject },
  });
});
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = req.project;

  const allowedFields = ["name", "description", "photo", "completed"];

  const filteredBody = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });

  if (filteredBody.name) {
    const existingProjectName = await prisma.project.findFirst({
      where: {
        name: filteredBody.name,
        NOT: {
          id: project.id,
        },
        active: true,
      },
    });
    if (existingProjectName) {
      return next(
        new AppError("You already have an existing project with that name", 400)
      );
    }
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: project.id,
    },
    data: filteredBody,
  });

  res.status(200).json({
    status: "success",
    data: {
      project: updatedProject,
    },
  });
});
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = req.project;
  // Fetch task IDs related to the project and extract only the IDs
  const taskIds = (
    await prisma.task.findMany({
      where: { projectId: project.id },
      select: { id: true },
    })
  ).map(({ id }) => id); // Cleaner destructuring

  // Execute all updates in a single transaction
  await prisma.$transaction([
    prisma.project.update({
      where: { id: project.id },
      data: { active: false },
    }),
    prisma.projectMember.updateMany({
      where: { projectId: project.id },
      data: { active: false },
    }),
    prisma.comment.updateMany({
      where: { taskId: { in: taskIds } },
      data: { active: false },
    }),
    prisma.task.updateMany({
      where: { projectId: project.id },
      data: { active: false },
    }),
  ]);

  res.status(204).send(); // Proper empty response for 204 status
});
exports.validateProjectOwnership = catchAsync(async (req, res, next) => {
  const project = req.project;

  if (!project) {
    return next(
      new AppError("The project ID is wrong or it's no longer available", 400)
    );
  }

  if (project.managerId !== req.user.id) {
    return next(new AppError("You don't own this project", 403));
  }

  req.project = project;
  next();
});
exports.validateProjectAuthority = catchAsync(async (req, res, next) => {
  const permittedRoles = ["MANAGER", "SUPERVISOR"];
  const project = req.project;

  if (!permittedRoles.includes(req.user.projectRole)) {
    return next(new AppError("You are forbidden to access that resource", 403));
  }
  next();
});
exports.checkProjectExistance = catchAsync(async (req, res, next) => {
  const projectId = Number(req.params.projectId); // Convert to number if needed

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || !project.active) {
    // Check if project is active (if applicable)
    return next(
      new AppError("The project ID is invalid or no longer exist", 400)
    );
  }

  req.project = project;
  next();
});
exports.addMember = catchAsync(async (req, res, next) => {
  const memberId = Number(req.body.memberId);

  if (!memberId) {
    return next(new AppError("Please provide an id", 400));
  }
  const member = await prisma.user.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member || !member.active) {
    return next(
      new AppError("The member id is not correct or the member is not exist")
    );
  }

  const alreadyInvitedUser = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: memberId,
        projectId: req.project.id,
      },
    },
  });

  let projectMember;

  if (alreadyInvitedUser) {
    if (alreadyInvitedUser.active === true) {
      return next(new AppError("The member already invited", 400));
    } else {
      projectMember = await prisma.projectMember.update({
        where: {
          userId_projectId: {
            userId: memberId,
            projectId: req.project.id,
          },
        },
        data: {
          active: true,
        },
      });
    }
  } else {
    projectMember = await prisma.projectMember.create({
      data: {
        userId: memberId,
        projectId: req.project.id,
      },
    });
  }

  const notification = await prisma.notification.create({
    data: {
      userId: member.id,
      type: "INVITATION",
      message: `You have been invited to a project ${req.project.name} by ${req.user.username}`,
      projectId: req.project.id,
      targetType: "PROJECT",
    },
  });

  if (req.app.get("socket")) {
    req.app.get("socket").sendNotifications(member.id, notification);
  }

  try {
    const email = new Email(member.firstName, member.email);
    await email.sendInvitationMail(
      req.project.name,
      `${req.user.firstName} ${req.user.lastName}`,
      `link/api/v1/project/:${req.project.id}/members/accept-invitation/:token`
    );
  } catch (error) {
    return next(
      new AppError("There was a problem in sending the invitation mail", 500)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      member: projectMember,
    },
  });
});

exports.editMemberRole = catchAsync(async (req, res, next) => {
  const memberId = Number(req.params.memberId);

  const memberProjectship = await prisma.projectMember.findFirst({
    where: {
      userId: memberId,
      projectId: req.project.id,
      memberStatus: "JOINED",
    },
  });

  if (!memberProjectship) {
    return next(
      new AppError(
        "The member you want to edit doesn't exist in the project or hasn't joined yet",
        400
      )
    );
  }

  const allowedFields = ["role"];
  const allowedValues = ["MEMBER", "SUPERVISOR"];

  const filteredBody = {};

  Object.keys(req.body).map((k) => {
    if (allowedFields.includes(k)) {
      filteredBody[k] = req.body[k];
    }
  });

  if (filteredBody.role) {
    if (!allowedValues.includes(filteredBody.role)) {
      return next(new AppError("The role you want to assign is invalid", 400));
    }
  } else {
    return next(
      new AppError("You can only edit the member role from that route", 400)
    );
  }

  const projectMember = await prisma.projectMember.update({
    where: {
      userId_projectId: {
        userId: memberId,
        projectId: req.project.id,
      },
    },
    data: {
      role: filteredBody.role,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      projectMember,
    },
  });
});

exports.deleteMember = catchAsync(async (req, res, next) => {
  const project = req.project;

  const memberId = Number(req.params.memberId);

  if (isNaN(memberId)) {
    return next(new AppError("Invalid member ID", 400));
  }

  const projectMember = await prisma.projectMember.findFirst({
    where: {
      projectId: project.id,
      userId: memberId,
      active: true,
    },
  });

  if (!projectMember) {
    return next(
      new AppError(
        "There is no user with that id or the user has already beed deleted",
        404
      )
    );
  }

  await prisma.projectMember.update({
    where: {
      userId_projectId: {
        userId: memberId,
        projectId: project.id,
      },
    },
    data: {
      active: false,
      memberStatus: "REMOVED",
    },
  });

  const notification = await prisma.notification.create({
    data: {
      userId: memberId,
      type: "PROJECTREMOVAL",
      message: "The project owner has removed you from the project",
      targetType: "PROJECT",
      projectId: project.id,
    },
  });

  if (req.app.get("socket")) {
    req.app.get("socket").sendNotifications(memberId, notification);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const user = req.user;
  const projectId = Number(req.params.projectId);

  if (isNaN(projectId)) {
    return next(new AppError("Invalid project ID", 400));
  }

  const projectMembership = await prisma.projectMember.findFirst({
    where: {
      userId: user.id,
      projectId: projectId,
    },
  });

  if (!projectMembership) {
    return next(new AppError("No invitation found for this project", 404));
  }

  if (projectMembership.memberStatus === "JOINED") {
    return next(new AppError("You have already accepted this invitation", 400));
  }

  // Use transaction for safer update
  const updatedMembership = await prisma.$transaction([
    prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
      data: {
        active: true,
        joinedAt: new Date(), // No need for Date.now()
        memberStatus: "JOINED",
      },
    }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      projectMember: updatedMembership[0],
    },
  });
});

exports.validateProjectAccess = catchAsync(async (req, res, next) => {
  const projectMembership = await prisma.projectMember.findFirst({
    where: {
      projectId: req.project.id,
      userId: req.user.id,
      active: true,
      memberStatus: "JOINED",
    },
  });

  if (!projectMembership) {
    return next(
      new AppError(
        "You are not authorized to access that project or You are no longer part of this project",
        400
      )
    );
  }

  req.user.projectRole = projectMembership.role;

  next();
});

exports.getAllManagerProjects = catchAsync(async (req, res, next) => {
  const id = req.user.id;

  const projects = await prisma.project.findMany({
    where: {
      managerId: id,
      active: true,
    },
    select: {
      id: true,
      name: true,
      description: true,
      photo: true,
      completed: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      projects,
    },
  });
});

exports.leaveProject = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const projectId = Number(req.params.projectId);

  // Find project membership first
  const projectMembership = await prisma.projectMember.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
      memberStatus: "JOINED", // Assuming "ACTIVE" means currently in the project
      active: true,
    },
  });

  if (!projectMembership) {
    return next(
      new AppError("You are not a member of this project or already left", 400)
    );
  }

  if (projectMembership.role == "MANAGER") {
    return next(
      new AppError(
        "You can not leave the project before assigning the project to another member",
        400
      )
    );
  }

  // Update the project membership status
  const updatedProject = await prisma.projectMember.update({
    where: {
      userId_projectId: {
        userId: userId,
        projectId: projectId,
      },
    },
    data: {
      memberStatus: "LEFT",
      active: false,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      projectMembership: updatedProject,
    },
  });
});

exports.getAllUserProjects = catchAsync(async (req, res, next) => {
  const id = req.user.id;

  const projectMembers = await prisma.projectMember.findMany({
    where: {
      userId: id,
      active: true, // Ensures only active memberships are considered
    },
    include: {
      project: {
        where: { active: true }, // Ensures only active projects are included
      },
    },
  });

  const projects = projectMembers.map((pm) => pm.project); // Extracts projects from memberships

  res.status(200).json({
    status: "success",
    data: {
      projects,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await prisma.project.findUnique({
    where: {
      id: req.project.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      photo: true,
      completed: true,
      createdAt: true,
      manager: {
        select: {
          id: true,
          username: true,
          email: true,
          photo: true,
        },
      },
      members: {
        select: {
          memberStatus: true,
          role: true,
          user: {
            select: {
              username: true,
              id: true,
              photo: true,
            },
          },
        },
      },
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      myRole:req.user.projectRole,
      project: project,
    },
  });
});

exports.transferManagership = catchAsync(async (req, res, next) => {
  const manager = req.user;
  const project = req.project;
  const newManagerId = Number(req.params.memberId);

  if (
    !(await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: newManagerId,
          projectId: project.id,
        },
      },
    }))
  ) {
    return next(
      new AppError(
        "You can not make a user not belongs to the project as a manager"
      )
    );
  }

  await prisma.$transaction([
    prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        managerId: newManagerId,
      },
    }),
    prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId: newManagerId,
          projectId: req.project.id,
        },
      },
      data: {
        role: "MANAGER",
      },
    }),
    prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: req.project.id,
        },
      },
      data: {
        role: "MEMBER",
      },
    }),
  ]);

  const notification = await prisma.notification.create({
    data: {
      userId: newManagerId,
      type: "PROJECTASSIGNMENT",
      message: `You have been assigned as the manager of "${project.name}" by ${manager.firstName} ${manager.lastName}.`,
      targetType: "PROJECT",
      projectId: project.id,
    },
  });

  if (req.app.get("socket")) {
    req.app.get("socket").sendNotifications(newManagerId, notification);
  }

  const projectAfterModifications = await prisma.project.findUnique({
    where: {
      id: project.id,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      project: projectAfterModifications,
    },
  });
});
