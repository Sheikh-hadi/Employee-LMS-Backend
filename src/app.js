import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from "morgan"

const app = express();
app.use(cors({
    origin: 'http://localhost:3000' || "https://employee-lms-6pp6.vercel.app"|| '*',
    credentials: true,
}));
app.use(morgan("short"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// routes
import userRoutes from './routes/user.route.js';
import employeeRoutes from './routes/employee.route.js';
import departmentRoutes from './routes/department.route.js';
import companyRoutes from './routes/company.route.js';
import authRoutes from './routes/auth.route.js';
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employee', employeeRoutes);
app.use('/api/v1/department', departmentRoutes);
app.use('/api/v1/company' ,  companyRoutes);
app.use('/api/v1/check-auth', authRoutes);

export default app;