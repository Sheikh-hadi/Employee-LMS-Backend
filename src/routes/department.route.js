import { Router } from "express";
import { createDepartment, getDepartment, deleteDepartment, updateDepartment } from "../controllers/department.controller.js";
const router = Router();

router.route('/').get(getDepartment);
router.route('/').post(createDepartment);
router.route('/:id').delete(deleteDepartment);
router.route('/:id').put(updateDepartment);
export default router;