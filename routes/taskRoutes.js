const { validateProjectAccess } = require("../controllers/projectsController");
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
  doneTask,
  getAssignedTasks,
} = require("../controllers/taskController");
const commentsRouter = require("./commentsRouter");
const taskRouter = require("express").Router();

taskRouter
  .route("/")
  .get(managerialAccess, getAllTasks)
  .post(managerialAccess, addTask);

taskRouter.route("/mine").get(validateProjectAccess, getAssignedTasks);

taskRouter
  .route("/:taskId")
  .all(checkTaskExistanceAndAccess)
  .get(getTask)
  .patch(updateAuthority, updateTask)
  .delete(deleteAuthority, deleteTask);

taskRouter
  .route("/:taskId/done")
  .patch(checkTaskExistanceAndAccess, doesItAssignedToMe, doneTask);

taskRouter.use(
  "/:taskId/comments",
  checkTaskExistanceAndAccess,
  commentsRouter
);

module.exports = taskRouter;
