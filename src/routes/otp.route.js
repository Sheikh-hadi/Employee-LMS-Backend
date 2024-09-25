import { Router } from 'express';
import {generateOtp, checkOpt} from '../controllers/otpGenerator.controller.js';

const router = Router();

router.route('/').post(generateOtp);
router.route('/check').post(checkOpt);
export default router;