const express = require("express");
const ErrorHandler = require("../utils/errorhandler");
const upload = require("../middleware/multer.jsx");
const router = express.Router();


const {
  registerUser,
  loginUser,
  logOut,
  forgotpassword,
  resetpassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getSingleuser,
  getAllusers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


// ✅ Routes
router.post("/register" , upload.single("avatar"), registerUser);


router.post("/login", loginUser);
router.get("/logout", logOut);

router.post("/password/forgot", forgotpassword);
router.put("/password/reset/:token", resetpassword);

router.get("/me", isAuthenticatedUser, getUserDetails);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, upload.single("avatar"), updateProfile);

// ✅ Admin routes
router.get("/admin/users", isAuthenticatedUser, authorizeRoles("admin"), getAllusers);
router.get("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), getSingleuser);
router.put("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
router.delete("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
