import { Router } from "express";
import { createEmployee, getEmployee } from "../controllers/employee.controller.js";
const router = Router();

router.route("/").get(getEmployee);
router.route("/").post(createEmployee);

export default router;