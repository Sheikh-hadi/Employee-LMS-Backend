import { Router } from "express";
import { createDepartment, getDepartment, deleteDepartment, updateDepartment } from "../controllers/department.controller.js";
import { isAuthenticated } from './../middlewares/auth.middelware.js';
const router = Router();

router.route('/').get(isAuthenticated, getDepartment);
router.route('/').post(isAuthenticated, createDepartment);
router.route('/:id').delete(isAuthenticated, deleteDepartment);
router.route('/:id').put(isAuthenticated, updateDepartment);
export default router;