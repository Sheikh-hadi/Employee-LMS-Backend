import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from "morgan"

const app = express();
app.use(cors());
app.use(morgan("short"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// routes
import userRoutes from './routes/user.route.js';
import employeeRoutes from './routes/employee.route.js';
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employee', employeeRoutes);


export default app;