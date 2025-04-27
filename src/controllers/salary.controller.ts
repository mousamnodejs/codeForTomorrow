import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import apiResponse from '../helper/api.response';
import message from '../helper/message';
import moment from 'moment';
import { getWorkingDaysInMonth } from '../helper/salaryCalculator';
const prisma = new PrismaClient();


  // Tax slabs configuration
  const TAX_SLABS = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250001, max: 500000, rate: 0.05 },
    { min: 500001, max: 1000000, rate: 0.2 },
    { min: 1000001, max: Infinity, rate: 0.3 }
  ];
  const calculateEmployeeSalary = async (req: Request, res: Response) => {
    try {
      const { employeeId, month } = req.body;
  
      // Step 1: Calculate the salary data
      const salaryData = await calculateSalary(employeeId, month);
  
      // Step 2: Check if a salary record already exists for the given employee and month
      const existingSalary = await prisma.salary.findUnique({
        where: {
            employeeId_month: {  
                employeeId: employeeId,
                month: month,
              },
        }
      });
  
      if (existingSalary) {
        // Step 3: If record exists, update the existing record
        const updatedSalary = await prisma.salary.update({
            where: {
                employeeId_month: { 
                    employeeId: employeeId,
                    month: month,
                  },
              },
          data: {
            basicSalary: salaryData.basicSalary,
            hra: salaryData.hra,
            allowances: salaryData.allowances,
            tax: salaryData.tax,
            pf: salaryData.pf,
            deductions: salaryData.deductions,
            totalDays: salaryData.totalDays,
            fullDays: salaryData.fullDays,
            halfDays: salaryData.halfDays,
            grossSalary: salaryData.grossSalary,
            netSalary: parseFloat(salaryData.netSalary.toFixed(2)), // Ensure 2 decimal places for net salary
            status: 'PENDING' // Default value
          }
        });
  
        // Return the updated salary
        apiResponse.successResponse(res, updatedSalary, message.salary.updated);
      } else {
        // Step 4: If record doesn't exist, create a new salary record
        const newSalary = await prisma.salary.create({
          data: {
            employeeId: employeeId,
            month: month,
            basicSalary: salaryData.basicSalary,
            hra: salaryData.hra,
            allowances: salaryData.allowances,
            tax: salaryData.tax,
            pf: salaryData.pf,
            deductions: salaryData.deductions,
            totalDays: salaryData.totalDays,
            fullDays: salaryData.fullDays,
            halfDays: salaryData.halfDays,
            grossSalary: salaryData.grossSalary,
            netSalary: parseFloat(salaryData.netSalary.toFixed(2)), // Ensure 2 decimal places for net salary
            status: 'PENDING' // Default value
          }
        });
  
        // Return the newly created salary
        apiResponse.createdResponse(res, newSalary, message.salary.created);
      }
    } catch (error: any) {
      apiResponse.errorResponse(res, error.message || 'Failed to calculate or save salary.');
    }
  };
  
  
  
   const  calculateSalary=async(employeeId: number, month: string) =>{
 
    const startDate = moment(month, 'YYYY-MM').startOf('month').toDate();
    const endDate = moment(month, 'YYYY-MM').endOf('month').toDate();

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        attendance: {
          where: {
            date: {
                gte: startDate,
                lte: endDate,
              },
              status: { in: ['PRESENT', 'HALF_DAY'] },
            },
        }
      }
    });
    if (!employee) {
      throw new Error('Employee not found');
    }
  
    // 1. Calculate Gross Salary
    const grossSalary = employee.basicSalary + employee.hra + employee.allowances;
    // 2. Calculate Tax (annual)
    const annualTax = calculateAnnualTax(grossSalary * 12);
    const monthlyTax = annualTax / 12;
  
    // 3. Calculate PF (12% of basic salary)
    const pf = employee.basicSalary * 0.12;
  
    // 4. Calculate daily wage
    const workingDays = getWorkingDaysInMonth(startDate, endDate);
    console.log('workingDays',workingDays)
    const dailyWage = grossSalary / workingDays;

    // 5. Calculate attendance-based salary
    let fullDays = 0;
    let halfDays = 0;
  
    employee?.attendance?.forEach(record => {
      if (record.status === 'HALF_DAY') {
        halfDays++;
      } else if ((record.hoursWorked || 0) >= 8) {
        fullDays++;
      } else if ((record.hoursWorked || 0) > 0) {
        halfDays++; // Less than 8 hours counts as half-day
      }
    });
  
  const fullDaysNumber = Number(fullDays) || 0;
  const halfDaysNumber = Number(halfDays) || 0;
  const dailyWageNumber = Number(dailyWage) || 0;
    // 6. Calculate total salary
    const totalSalary = (fullDaysNumber * dailyWageNumber) + (halfDaysNumber * (dailyWageNumber / 2));
    // 7. Calculate net salary
    const netSalary = totalSalary - monthlyTax - pf - employee.deductions;
  
    return {
      basicSalary: employee?.basicSalary,
      hra: employee?.hra,
      allowances: employee?.allowances,
      tax: monthlyTax,
      pf,
      deductions: employee?.deductions,
      totalDays: workingDays,
      fullDays,
      halfDays,
      grossSalary,
      netSalary: netSalary
    };
  }
  
  function calculateAnnualTax(annualIncome: number): number {
    let tax = 0;
    for (const slab of TAX_SLABS) {
      if (annualIncome > slab.min) {
        const taxableAmount = Math.min(annualIncome, slab.max) - slab.min;
        tax += taxableAmount * slab.rate;
      }
    }
    return tax;
  }


  const getEmployeeSalary = async (req: Request, res: Response)=> {
    try {
      // Extracting employeeId from URL params and month from query params
      const { id } = req.params;
      const { month } = req.query;
  
      if (!id || !month)  apiResponse.badResponse(res, 'Employee ID and month are required.');
      
      // Find salary record by employeeId and month and include employee details
      const salary = await prisma.salary.findUnique({
        where: {
          employeeId_month: {
            employeeId: parseInt(id),  
            month: month as string,  
          },
        },
        include: {
          employee: true  // This will include the employee's details in the response
        },
      });
  
  
      // Send the salary data with employee information as a response
       apiResponse.successResponse(res, salary, message.salary.fetchEmployeeSalary);
    } catch (error:any) {
      console.error(error);
       apiResponse.errorResponse(res, error.message || 'An unexpected error occurred.');
    }
  };
  
  export default {calculateEmployeeSalary,getEmployeeSalary}