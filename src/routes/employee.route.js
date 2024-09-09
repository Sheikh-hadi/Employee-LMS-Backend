import { Router } from "express";
import { createEmployee, getEmployee, deleteEmployee, updateEmployee } from "../controllers/employee.controller.js";
const router = Router();

router.route("/").get(getEmployee);
router.route("/").post(createEmployee);
router.route('/:id').delete(deleteEmployee)
router.route('/:id').put(updateEmployee)

export default router;