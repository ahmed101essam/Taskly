const { protect } = require("../controllers/authController");
const {
  addProject,
  updateProject,
  deleteProject,
  validateProjectOwnership,
  addMember,
  deleteMember,
  acceptInvitation,
  getAllManagerProjects,
  validateProjectAuthority,
  editMemberRole,
  transferManagership,
  getProject,
  checkProjectExistance,
  validateProjectAccess,
  getAllMembers
} = require("../controllers/projectsController");
const { uploadImage } = require("../utils/imageCloud");
const upload = require("../utils/multer");
const taskRouter = require("./taskRoutes");

const projectRouter = require("express").Router();

projectRouter.use(protect);

projectRouter
  .route("/")
  .post(upload.single("photo"), uploadImage, addProject)
  .get(getAllManagerProjects);

projectRouter
  .route("/:projectId")
  .get(checkProjectExistance, validateProjectAccess, getProject)
  .patch(
    validateProjectOwnership,
    upload.single("photo"),
    uploadImage,
    updateProject
  )
  .delete(validateProjectOwnership, deleteProject);

projectRouter
  .route("/:projectId/members")
  .all(validateProjectAuthority)
  .post(addMember)
  .get(getAllMembers);

projectRouter
  .route("/:projectId/members/:memberId")
  .all(validateProjectOwnership)
  .delete(deleteMember)
  .patch(editMemberRole)
  .post(transferManagership);

projectRouter
  .route("/:projectId/invitation/accept")
  .post(protect, acceptInvitation);

projectRouter.use(
  "/:projectId/tasks",
  checkProjectExistance,
  validateProjectAccess,
  taskRouter
);

module.exports = projectRouter;
