import { Router } from "express";
import { getUser, registerUser, deleteUser, logoutUser, loginUser } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middelware.js";
const router = Router();

router.route("/").get(isAuthenticated, getUser);
router.route("/register").post(registerUser);
router.route("/:id").delete(deleteUser);
router.route("/logout").post(isAuthenticated, logoutUser);
router.route("/login").post(loginUser);

export default router;