const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const prisma = require("../utils/database");

exports.readNotifications = catchAsync(async (req, res, next) => {
  const user = req.user;
  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });
  res.status(200).json({
    status: "success",
    message: "Notifications read successfully",
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({
      status: "fail",
      message: "Query parameter is required",
    });
  }

  const users = await prisma.user.findMany({
    where: {
      verified: true,
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
    },
    take: 10, // Limit results
  });

  res.status(200).json({
    status: "success",
    data: users,
  });
});

exports.me = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      me: user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError("You cannot modify your password by that route", 400)
    );
  }
  if (req.body.email || req.body.username) {
    return next(new AppError("You cannot modify your username or email", 400));
  }
  const changedUser = {};

  if (req.body.photo) {
    changedUser.photo = req.body.photo;
  }
  if (req.body.firstName) {
    changedUser.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    changedUser.lastName = req.body.lastName;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: changedUser,
  });

  res.status(200).json({
    status: "success",
    body: {
      user: updatedUser,
    },
  });
});
