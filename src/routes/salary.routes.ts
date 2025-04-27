import express from 'express';
import Controller from '../controllers/salary.controller'; // Default import
import AuthMiddleware from '../middlewares/auth.middleware'; 

const route = express.Router();
route
.post('/calculate',AuthMiddleware, Controller.calculateEmployeeSalary)
.get('/employeeById/:id', AuthMiddleware,Controller.getEmployeeSalary)
export default route;