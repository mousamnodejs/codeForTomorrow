import express from 'express';
import Controller from '../controllers/payroll.controller'; // Default import
import AuthMiddleware from '../middlewares/auth.middleware'; 

const route = express.Router();
route
    .post('/distribute/:salaryId',AuthMiddleware, Controller.updateSalaryStatus)
    .get('/history',AuthMiddleware, Controller.payrollHistory)
export default route;