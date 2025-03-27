const { protect } = require("../controllers/authController");
const {
  addProject,
  updateProject,
  deleteProject,
  validateProjectOwnership,
  addMember,
  deleteMember,
  acceptInvitation,
} = require("../controllers/projectsController");
const { uploadImage } = require("../utils/imageCloud");
const upload = require("../utils/multer");

const projectRouter = require("express").Router();

projectRouter.use(protect);

projectRouter.route("/").post(upload.single("photo"), uploadImage, addProject);

projectRouter
  .route("/:id")
  .all(validateProjectOwnership)
  .patch(upload.single("photo"), uploadImage, updateProject)
  .delete(deleteProject);

projectRouter
  .route("/:id/members")
  .all(validateProjectOwnership)
  .post(addMember);

projectRouter
  .route("/:id/members/:memberId")
  .all(validateProjectOwnership)
  .delete(deleteMember);

projectRouter.route("/:id/invitation/accept").post(protect, acceptInvitation);

module.exports = projectRouter;
