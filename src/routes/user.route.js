import { Router } from "express";
import { getUser } from "../controllers/user.controllers.js";
const router = Router();

router.route("").get(getUser);

export default router;