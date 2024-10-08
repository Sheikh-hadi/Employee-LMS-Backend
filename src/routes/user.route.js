import { Router } from "express";
import { getUser, registerUser, deleteUser, logoutUser, loginUser, getUserById, updateUser, checkMail, changeCurrentPassword } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middelware.js";
const router = Router();

router.route("/").get(isAuthenticated, getUser);
router.route("/register").post(registerUser);
router.route("/:id").delete(isAuthenticated, deleteUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/login").post(loginUser);
router.route("/:id").get(isAuthenticated, getUserById);
router.route("/update/:id").put(updateUser)
router.route("/Check-email").post(checkMail)
router.route("/change-password").post(changeCurrentPassword);

export default router;