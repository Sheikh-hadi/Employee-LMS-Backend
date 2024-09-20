import { Router } from "express";
import { getUser, registerUser, deleteUser, logoutUser, loginUser, getUserById } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middelware.js";
const router = Router();

router.route("/").get( getUser);
router.route("/register").post(registerUser);
router.route("/:id").delete(deleteUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getUserById);

export default router;