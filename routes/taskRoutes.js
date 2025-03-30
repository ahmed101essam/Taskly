const { protect } = require("../controllers/authController");
const {
  validateProjectOwnership,
  validateProjectAuthority,
} = require("../controllers/projectsController");
const {
  addProjectIdToParams,
  addTask,
} = require("../controllers/taskController");

const taskRouter = require("express").Router();

taskRouter
  .route("/")
  .post(protect, addProjectIdToParams, validateProjectAuthority, addTask);

taskRouter
  .route("/:taskId")
  .patch(protect, addProjectIdToParams, validateProjectAuthority, editTask);

taskRouter.use("/:taskId/comments");

module.exports = taskRouter;
