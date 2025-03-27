const { PrismaClient } = require("@prisma/client");
const catchAsync = require("../utils/catchAsync");
const prisma = new PrismaClient();

exports.readNotifications = catchAsync(async (req, res, next) => {
  const user = req.user;

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
    },
    data: {
      read: true,
    },
  });
});
