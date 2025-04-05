const catchAsync = require("../utils/catchAsync");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Email = require("../utils/email");
const AppError = require("../utils/appError");
const jsonwebtoken = require("jsonwebtoken");

exports.signup = catchAsync(async (req, res, next) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    photo: req.body.photo,
  };
  console.log(req.body.photo);

  const existingEmail = await prisma.user.findUnique({
    where: { email: user.email },
  });

  const existingUsername = await prisma.user.findUnique({
    where: { username: user.username },
  });

  if (existingEmail) {
    return next(new AppError("This email is already in use", 400));
  }

  if (existingUsername) {
    return next(new AppError("This username is already taken", 400));
  }

  user.password = await bcrypt.hash(user.password, 12);
  const verifyToken = crypto.randomInt(100000, 1000000);
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verifyToken.toString())
    .digest("hex");
  user.verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const newUser = await prisma.user.create({
    data: {
      ...user,
    },
  });
  const email = new Email(newUser.firstName, newUser.email);
  email.sendVerificationMail(verifyToken);
  res.status(201).json({
    status: "success",
    message: "User created successfully Please Enter the token.",
  });
});
exports.verifyAccount = catchAsync(async (req, res, next) => {
  const { verificationToken, email } = req.body;
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  // Find user by email
  const candidateUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!candidateUser) {
    return next(new AppError("There is no user found with that email", 400));
  }
  // Check if token is valid and not expired
  if (
    candidateUser.verificationToken !== hashedToken ||
    !candidateUser.verificationTokenExpiresAt ||
    candidateUser.verificationTokenExpiresAt < new Date()
  ) {
    return next(
      new AppError("The token you provided is wrong or has expired", 400)
    );
  }
  // Update user as verified
  await prisma.user.update({
    where: { id: candidateUser.id },
    data: {
      verificationToken: null,
      verificationTokenExpiresAt: null,
      verified: true,
    },
  });
  res.status(200).json({
    status: "success",
    message: "You have been verified successfully",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const usernameOrEmail = req.body.usernameOrEmail;
  const password = req.body.password;
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: usernameOrEmail,
        },
        {
          username: usernameOrEmail,
        },
      ],
    },
  });

  if (!user) {
    return next(new AppError("The email or username is not found", 400));
  }
  if (!user.verified) {
    return next(new AppError("You are account is not verified yet", 403));
  }

  if (!password || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("The password is wrong", 401));
  }

  const token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // res.cookie("jwt", token, {
  //   limit: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
  //   ),
  //   // secure: true,
  //   httpOnly: true,
  // });
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: false, // set false in development if not using HTTPS
  //   sameSite: "None", // required for cross-site cookies
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Ensure Authorization header is present and well-formed
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // const token = req.cookies.token;

  if (!token) {
    return next(
      new AppError(
        "You are not logged in! Please log in to access this resource.",
        401
      )
    );
  }

  try {
    // Verify the token
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // Attach user to request object
    req.user = currentUser;

    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token! Please log in again.", 401)
    );
  }
});

exports.resendVerificationToken = catchAsync(async (req, res, next) => {
  let user = await prisma.user.findFirst({
    where: {
      email: req.body.email,
      verified: false,
    },
  });

  if (!user) {
    return next(
      new AppError("The user already verified or you didn't signup", 400)
    );
  }

  const verifyToken = crypto.randomInt(100000, 1000000);
  const verificationToken = crypto
    .createHash("sha256")
    .update(verifyToken.toString())
    .digest("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verificationToken: verificationToken,
      verificationTokenExpiresAt: verificationTokenExpiresAt,
    },
  });

  const email = new Email(user.firstName, user.email);
  email.sendVerificationMail(verifyToken);
  res.status(200).json({
    status: "success",
    message: "Verification token has been sent to you email",
  });
});
