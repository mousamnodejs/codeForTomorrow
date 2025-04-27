import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import apiResponse from '../helper/api.response';
import message from '../helper/message';
import pagination from '../helper/pagination'; // Importing pagination helper
const prisma = new PrismaClient();

// Create employee

const createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      // Creating the employee in the database
      const employee = await prisma.employee.create({
        data: req.body,  // Assuming the request body contains the necessary fields
      });
  
      // Returning success response
       apiResponse.createdResponse(res, employee, message.employee.created);
    } catch (error: any) {
      // Catching errors and returning an error response
       apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
    }
  };

// Get all employees


const getEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 0, limit = 10 } = req.query;
        // Pagination setup
        const { pageNumber, limitNumber, offset } = pagination.getPagination(page as number, limit as number);
        // Initialize the where clause
        let whereClause: any = {};
        // Fetch paginated data from the database
        const employeeData = await prisma.employee.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limitNumber,
        });

        // Get total count
        const totalRecords = await prisma.employee.count({where: whereClause });
        // Prepare response
        const result = pagination.getPaginationData( employeeData,  pageNumber, limitNumber, totalRecords);
        // Send success response
        apiResponse.successResponse(res, result, message.employee.data);
    } catch (error: any) {
        apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
    }
};



// Get employee by ID
 const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if(!employee) { apiResponse.notFoundResponse(res,message.employee.notFound) }
     apiResponse.successResponse(res, employee,message.employee.data,)
  } catch (error:any) {
    apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
  }
};

// Update employee
 const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
   apiResponse.successResponse(res,employee,message.employee.updated)
  } catch (error:any) {
    apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
  }
};


export default {createEmployee,getEmployeeById,updateEmployee,getEmployees}