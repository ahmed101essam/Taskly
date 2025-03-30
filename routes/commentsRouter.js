const { protect } = require("../controllers/authController");
const {
  checkTaskExistanceAndAccess,
  addComment,
  updateComment,
  getTaskComments,
  deleteComment,
  getComment,
} = require("../controllers/commentsController");
const { checkProjectExistance } = require("../controllers/projectsController");

const commentsRouter = require("express").Router();

commentsRouter.use(protect, checkProjectExistance, checkTaskExistanceAndAccess);

commentsRouter.route("/").post(addComment).get(getTaskComments);

commentsRouter
  .route("/:commentId")
  .patch(updateComment)
  .delete(deleteComment)
  .get(getComment);
