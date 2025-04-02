const {
  signup,
  verifyAccount,
  login,
  protect,
  resendVerificationToken,
} = require("../controllers/authController");
const { getAllManagerProjects } = require("../controllers/projectsController");
const { myTasks } = require("../controllers/taskController");
const { me, updateMe } = require("../controllers/usersController");
const { uploadImage } = require("../utils/imageCloud");
const upload = require("../utils/multer");
const { use } = require("./taskRoutes");

const userRouter = require("express").Router();

userRouter.post("/signup", upload.single("photo"), uploadImage, signup);
userRouter.post("/verify", verifyAccount);
userRouter.post("/login", login);
userRouter.post("/resendVerification", resendVerificationToken);
userRouter
  .route("/me")
  .all(protect)
  .get(me)
  .patch(upload.single("photo"), uploadImage, updateMe);
userRouter.get("/myProjects", protect, getAllManagerProjects);
userRouter.get("/myTasks", protect, myTasks);

module.exports = userRouter;
