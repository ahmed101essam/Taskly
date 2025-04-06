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
  getAllMembers,
  leaveProject,
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
  .all(checkProjectExistance)
  .get(validateProjectAccess, getProject)
  .patch(
    validateProjectOwnership,
    upload.single("photo"),
    uploadImage,
    updateProject
  )
  .delete(validateProjectOwnership, deleteProject);

projectRouter
  .route("/:projectId/members")
  .all(checkProjectExistance, validateProjectAccess)
  .post(validateProjectAuthority, addMember)
  .get(getAllMembers);

projectRouter
  .route("/:projectId/members/:memberId")
  .all(checkProjectExistance, validateProjectOwnership)
  .delete(deleteMember)
  .patch(editMemberRole)
  .post(transferManagership);

projectRouter
  .route("/:projectId/leave")
  .patch(checkProjectExistance, validateProjectAccess, leaveProject);

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
