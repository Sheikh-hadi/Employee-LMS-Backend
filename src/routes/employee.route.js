import { Router } from "express";
import { createEmployee, getEmployee, deleteEmployee } from "../controllers/employee.controller.js";
const router = Router();

router.route("/").get(getEmployee);
router.route("/").post(createEmployee);
router.route('/:id').delete(deleteEmployee)

export default router;