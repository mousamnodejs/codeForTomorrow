import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import apiResponse from '../helper/api.response';
import message from '../helper/message';
import pagination from '../helper/pagination'; 
const prisma = new PrismaClient();

const updateSalaryStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { salaryId } = req.params;
        const { status } = req.body;
        const updatedSalary = await prisma.salary.update({
            where: { id: parseInt(salaryId) },
            data: {
                status,
                paidDate: status === 'PAID' ? new Date() : null,
            },
        });
        apiResponse.successResponse(res, updatedSalary, message.salary.updated);
    } catch (error: any) {
        apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
    }
};

const payrollHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { month, page = 0, limit = 10 } = req.query;
        // Pagination setup
        const { pageNumber, limitNumber, offset } = pagination.getPagination(page as number, limit as number);
        // Initialize the where clause
        let whereClause: any = { status: 'PAID' };
        
        if (month)  whereClause.month = month as string; 

        // Fetch paginated data from the database
        const payrollHistoryData = await prisma.salary.findMany({
            where: whereClause,
            include:{employee:true}, // Include employee details
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limitNumber,
        });

        // Get total count
        const totalRecords = await prisma.salary.count({where: whereClause });
        // Prepare response
        const result = pagination.getPaginationData( payrollHistoryData,  pageNumber, limitNumber, totalRecords);
        // Send success response
        apiResponse.successResponse(res, result, message.salary.fetchEmployeeSalary);
    } catch (error: any) {
        apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
    }
};


export default { updateSalaryStatus, payrollHistory };
