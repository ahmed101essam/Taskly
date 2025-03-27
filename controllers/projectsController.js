const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { PrismaClient } = require("@prisma/client");
const Email = require("../utils/email");
const crypto = require("crypto");

const prisma = new PrismaClient();
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
  const project = await prisma.project.findFirst({
    where: {
      id: req.params.id,
      active: true,
    },
  });

  if (!project) {
    return next(
      new AppError("The project ID is wrong or it's no longer available", 400)
    );
  }

  if (project.managerId !== req.user.id) {
    return next(new AppError("You cannot delete this project", 403));
  }

  req.project = project;
  next();
});

exports.addMember = catchAsync(async (req, res, next) => {
  const memberId = req.body.memberId;
  if (!req.project.active) {
    return next(
      new AppError("Cannot modify members of an inactive project", 400)
    );
  }

  if (!memberId) {
    return next(new AppError("Please provide an id", 400));
  }
  const member = await prisma.user.findFirst({
    where: {
      id: memberId,
      active: true,
    },
  });

  if (!member) {
    return next(
      new AppError("The member id is not correct or the member is not exist")
    );
  }

  const alreadyInvitedUser = await prisma.projectMember.findFirst({
    where: {
      userId: memberId,
      projectId: req.project.id,
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
      targetId: req.project.id,
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
    },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const user = req.user;
  const projectId = Number(req.params.id);

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

  if (projectMembership.active) {
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

exports.getAllManagerProjects = catchAsync(async (req, res, next) => {
  const id = req.user.id;

  const projects = await prisma.project.findMany({
    where: {
      managerId: id,
      active: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      projects,
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
  const user = req.user;
  const projectId = Number(req.params.id);

  // check that the project id is valid
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      active: true,
    },
  });

  if (!project) {
    return next(
      new AppError(
        "The project id is invalid or the project is no longer exists",
        400
      )
    );
  }
  // check that the user is manager or member in it

  const membership = await prisma.projectMember.findFirst({
    where: {
      projectId: projectId,
      active: true,
      userId: user.id,
    },
  });

  if (project.managerId === user.id || membership) {
    res.status(200).json({
      status: "success",
      data: {
        project: project,
      },
    });
  } else {
    return next(new AppError("You are not a part of that project", 403));
  }
});
