import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middelware.js'
import { auth } from '../controllers/auth.controller.js';
const router = express.Router();

router.route('/').get(isAuthenticated, auth)


export default router;
