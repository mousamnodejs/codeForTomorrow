import express from 'express';
import Controller from '../controllers/employee.controller'; 
import AuthMiddleware from '../middlewares/auth.middleware'; 
import validateRequest from '../middlewares/validate';
import { employeeValidationSchema } from '../helper/validationSchemas'; // Import your validation schema
const route = express.Router();
route
.post('/register', AuthMiddleware,validateRequest(employeeValidationSchema),Controller.createEmployee)
.get('/getById/:id',AuthMiddleware, Controller.getEmployeeById)
 .put('/updateById/:id',AuthMiddleware, Controller.updateEmployee)
 .get('/getList',AuthMiddleware,AuthMiddleware, Controller.getEmployees)
export default route;