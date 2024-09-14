import { Router } from "express";
import { createEmployee, getEmployee, deleteEmployee, updateEmployee } from "../controllers/employee.controller.js";
import { isAuthenticated } from "../middlewares/auth.middelware.js";
const router = Router();

router.route("/").get(isAuthenticated, getEmployee);
router.route("/").post(isAuthenticated, createEmployee);
router.route('/:id').delete(isAuthenticated, deleteEmployee)
router.route('/:id').put(isAuthenticated, updateEmployee)

export default router;