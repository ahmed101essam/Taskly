// const Server = require("socket.io");
const jwt = require("jsonwebtoken");
const AppError = require("./utils/appError");
const catchAsyncSocket = require("./utils/catchAsyncSocket");

const prisma = require("./utils/database");

class Socket {
  constructor(server) {
    this.io = require("socket.io")(server);

    this.users = new Map();
    this.io.use(
      catchAsyncSocket(async (socket, next) => {
        const token = socket.handshake.query.token;
        console.log(socket.handshake);

        console.log("Hello", token);
        socket.emit("hello", "hello");
        if (!token) {
          return next(
            new AppError("Authentication error: No token provided", 401)
          );
        }
        let user = await jwt.verify(token, process.env.JWT_SECRET);

        if (!user.id) {
          return next(new AppError("This token is invalid", 400));
        }
        user = await prisma.user.findUnique({ where: { id: user.id } });
        if (!user) {
          return next(new AppError("This token is invalid", 400));
        }
        socket.user = user;
        next();
      })
    );

    this.io.on("connection", async (socket) => {
      console.log(`User connected: ${socket.user.id}`);
      const userId = socket.user.id;
      console.log(this.users.has(userId));

      if (!this.users.has(userId)) {
        this.users.set(userId, []);
      }
      this.users.get(userId).push(socket);
      const user = await prisma.user.findFirst({
        where: {
          id: socket.user.id,
        },
      });

      if (!user) {
        socket.disconnect();
        return next(new AppError("There is no user with that id", 400));
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          online: true,
        },
      });

      const notifications = await prisma.notification.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      socket.emit("notifications", notifications);

      socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        console.log(this.users.get(userId));

        this.users.set(
          userId,
          this.users.get(userId).filter((s) => s.id === socket.id)
        );
        if (this.users.get(userId).length === 0) {
          this.users.delete(userId);
          await prisma.user.update({
            where: { id: socket.user.id },
            data: { online: false },
          });
        }
      });
    });
  }
  sendNotifications(userId, notification) {
    if (this.users.has(userId)) {
      this.users.get(userId).forEach((s) => {
        s.emit("notification", notification);
      });
    }
  }
}

module.exports = Socket;
