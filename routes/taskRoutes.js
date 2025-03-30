const { protect } = require("../controllers/authController");
const {
  addTask,
  checkTaskExistanceAndAccess,
  updateTask,
  getAllTasks,
  managerialAccess,
  getTask,
  updateDeleteAuthority,
  deleteTask,
} = require("../controllers/taskController");

const taskRouter = require("express").Router();

taskRouter.route("/").all(managerialAccess).post(addTask).get(getAllTasks);

taskRouter
  .route("/:taskId")
  .all(checkTaskExistanceAndAccess)
  .patch(managerialAccess, updateDeleteAuthority, updateTask)
  .get(getTask)
  .delete(managerialAccess, updateDeleteAuthority, deleteTask);

taskRouter.use("/:taskId/comments");

module.exports = taskRouter;
