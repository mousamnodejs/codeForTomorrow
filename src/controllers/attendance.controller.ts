import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import apiResponse from '../helper/api.response';
import message from '../helper/message';
import moment from 'moment';
const prisma = new PrismaClient();

const markAttendance = async (req: Request, res: Response) => {
    try {
      const {employeeId} = req.body; 
      console.log(employeeId)
      const today = moment().startOf('day').toDate();     // today at 00:00
      const tomorrow = moment().add(1, 'day').startOf('day').toDate(); // tomorrow at 00:00
      // Check if already marked today
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          employeeId,
          date: {
            gte: today,   // greater than or equal today 00:00
            lt: tomorrow, // less than tomorrow 00:00
          }
        }
      });
 
      if (existingAttendance){
        const updatedAttendance = await prisma.attendance.update({
            where: {
              id: existingAttendance.id,
            },
            data: req.body,
              
          });
    
         apiResponse.successResponse(res, updatedAttendance, message.attendance.updated);
      }
      // Create new attendance entry
       const attendance = await prisma.attendance.create({
        data: req.body,
        });
  
       apiResponse.createdResponse(res, attendance, message.attendance.created);
  
    } catch (error: any) {
       apiResponse.errorResponse(res, error.message || 'Something went wrong.');
    }
  };

  export default {markAttendance}