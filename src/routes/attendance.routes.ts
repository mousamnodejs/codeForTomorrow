import express from 'express';
import Controller from '../controllers/attendance.controller'; // Default import
import AuthMiddleware from '../middlewares/auth.middleware'; 
import validateRequest from '../middlewares/validate';
import { attendanceValidationSchema } from '../helper/validationSchemas'; // Import your validation schema
const route = express.Router();
route
.post('/mark',AuthMiddleware,validateRequest(attendanceValidationSchema), Controller.markAttendance)

export default route;