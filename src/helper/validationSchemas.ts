import Joi from 'joi';
import { Role, AttendanceStatus, SalaryStatus } from '@prisma/client';

 const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).max(100).required(),
//   role: Joi.string().valid(...Object.values(Role)).default(Role.HR)
});

 const employeeValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  dob: Joi.date().max(new Date(new Date().setFullYear(new Date().getFullYear() - 18))).required(),
  joinDate: Joi.date().default(() => new Date()),
  basicSalary: Joi.number().positive().required(),
  hra: Joi.number().min(0).default(0),
  allowances: Joi.number().min(0).default(0),
  taxSlab: Joi.string().valid('SLAB_1', 'SLAB_2', 'SLAB_3', 'SLAB_4').default('SLAB_1'),
  deductions: Joi.number().min(0).default(0)
});

 const attendanceValidationSchema = Joi.object({
  employeeId: Joi.number().integer().positive().required(),
  date: Joi.date().required(),
  checkIn: Joi.string().required(),
  checkOut: Joi.string().optional(),
  hoursWorked: Joi.number().min(0).max(24).optional(),
  status: Joi.string().valid(...Object.values(AttendanceStatus)).default(AttendanceStatus.PRESENT)
});

 

export { userValidationSchema,employeeValidationSchema,attendanceValidationSchema}