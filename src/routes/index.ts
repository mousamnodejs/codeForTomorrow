
import express from 'express'
import employeeRoute from './employee.routes'
import attendanceRoute from './attendance.routes'
import salaryRoute from './salary.routes'
import payroll from './payroll.routes'
import authRoute from './auth.route'
const router = express.Router()


const defaultRoutes = [
    {path:'/auth',
      route:authRoute
    },
    {
      path:'/employee',
      route:employeeRoute
    },
    {
      path:'/attendance',
      route:attendanceRoute
    },
    {
      path:'/salary',
      route:salaryRoute
    },
    {path:'/payroll',
      route:payroll
    }

]
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
export default router