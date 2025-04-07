const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addComment = catchAsync(async (req, res, next) => {
  if (!req.body.content || !req.body.content.trim()) {
    return next(new AppError("You didn't provide any comment content", 400));
  }

  const comment = await prisma.comment.create({
    data: {
      content: req.body.content.trim(),
      taskId: req.task.id,
      userId: req.user.id,
    },
    select: {
      content: true,
      id: true,
      createdAt: true,
      user: {
        select: {
          photo: true,
          username: true,
          id: true,
        },
      },
    },
  });

  notify(req, comment.id, "commented");

  res.status(200).json({
    status: "success",
    data: { comment },
  });
});

exports.getTaskComments = catchAsync(async (req, res, next) => {
  const comments = await prisma.comment.findMany({
    where: {
      taskId: req.task.id,
      active: true,
    },
    orderBy: { createdAt: "asc" },
    select: {
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          photo: true,
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: { comments },
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(req.params.commentId) },
  });

  if (!comment || !comment.active) {
    return next(
      new AppError("The comment id is invalid or no longer exists", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: { comment },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(req.params.commentId) },
  });

  if (!comment || !comment.active) {
    return next(
      new AppError("The comment id is invalid or no longer exists", 404)
    );
  }

  // Only manager or the author can delete the comment
  if (
    req.projectMembership.role !== "MANAGER" &&
    comment.userId !== req.user.id
  ) {
    return next(
      new AppError("You are not authorized to delete this comment", 403)
    );
  }

  await prisma.comment.update({
    where: { id: comment.id },
    data: { active: false },
  });

  notify(req, comment.id, "deleted his comment");

  res.status(200).json({
    status: "success",
    message: "The comment has been deleted successfully",
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  let comment = await prisma.comment.findUnique({
    where: { id: Number(req.params.commentId) },
  });

  if (!comment || !comment.active) {
    return next(
      new AppError("The comment id is invalid or no longer exists", 404)
    );
  }

  // Only the author can update the comment
  if (comment.userId !== req.user.id) {
    return next(
      new AppError("You are not authorized to update this comment", 403)
    );
  }

  if (!req.body.content.trim().length === 0) {
    new AppError("Please provide content to be updated by", 400);
  }

  comment = await prisma.comment.update({
    where: { id: comment.id },
    data: { content: req.body.content.trim() },
  });

  notify(req, comment.id, "updated his comment");

  res.status(200).json({
    status: "success",
    data: { comment },
  });
});

const allTheInvolvedExceptTheOneWhoCommented = async (req) => {
  const involvedUsers = await prisma.comment.findMany({
    where: {
      taskId: req.task.id,
      active: true,
      userId: { not: req.user.id }, // Exclude the user who commented
    },
    distinct: ["userId"],
    select: {
      userId: true,
    },
  });

  if (involvedUsers.length === 0) {
    if (req.user.id === req.task.assignedTo)
      involvedUsers.push({ userId: req.task.createdBy });
    else if (req.user.id === req.task.createdBy)
      involvedUsers.push({ userId: req.task.assignedTo });
    else
      involvedUsers.push(
        { userId: req.task.createdBy },
        { userId: req.task.assignedTo }
      );
  }

  return involvedUsers;
};

const notifyTheInvloved = async (req, message, commentId, involvedUsers) => {
  involvedUsers.forEach(async ({ userId }) => {
    const notification = await prisma.notification.create({
      data: {
        userId: userId,
        message: message,
        projectId: req.project.id,
        taskId: req.task.id,
        commentId: commentId,
        targetType: "COMMENT",
        type: "COMMENT",
      },
    });

    if (req.app.get("socket")) {
      req.app.get("socket").sendNotifications(userId, notification);
    }
  });
};

const notify = async (req, commentId, message) => {
  const involvedUsers = await allTheInvolvedExceptTheOneWhoCommented(req);
  await notifyTheInvloved(
    req,
    `${req.user.username} ${message} on the task: "${req.task.title}". Click here to view.`,
    commentId,
    involvedUsers
  );
};
