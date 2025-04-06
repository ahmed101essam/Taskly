const {
  addComment,
  updateComment,
  getTaskComments,
  deleteComment,
  getComment,
} = require("../controllers/commentsController");
const commentsRouter = require("express").Router();

commentsRouter.route("/").post(addComment).get(getTaskComments);

commentsRouter
  .route("/:commentId")
  .patch(updateComment)
  .delete(deleteComment)
  .get(getComment);

module.exports = commentsRouter;
