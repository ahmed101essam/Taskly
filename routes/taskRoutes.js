const {
  managerialAccess,
  getAllTasks,
  addTask,
  checkTaskExistanceAndAccess,
  getTask,
  updateTask,
  deleteTask,
  updateAuthority,
  deleteAuthority,
  doesItAssignedToMe,
} = require("../controllers/taskController");
const commentsRouter = require("./commentsRouter");
const taskRouter = require("express").Router();

taskRouter
  .route("/")
  .get(managerialAccess, getAllTasks)
  .post(managerialAccess, addTask);

taskRouter
  .route("/:taskId")
  .all(checkTaskExistanceAndAccess)
  .get(getTask)
  .patch(updateAuthority, updateTask)
  .delete(deleteAuthority, deleteTask);

taskRouter.route("/:taskId/done").patch(doesItAssignedToMe);

taskRouter.use("/:taskId/comments", commentsRouter);

module.exports = taskRouter;
