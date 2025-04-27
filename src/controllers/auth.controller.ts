import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import apiResponse from '../helper/api.response';
import message from '../helper/message';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const saltRounds = 10; // You can set it higher for better security
const jwtSecret = process.env.JWT_SECRET

 const authRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
             apiResponse.badResponse(res, message.auth.userExists);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                fullName,            
                email,
                password: hashedPassword,
            },
        });

        apiResponse.createdResponse(res, newUser, message.auth.registerSuccess);
    } catch (error: any) {
        apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
    }
};

export const authLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
          apiResponse.errorResponse(res, message.auth.invalidCredentials);
      }
  
      const isPasswordValid = user?.password ? await bcrypt.compare(password, user.password) : false;
      if (!isPasswordValid) {
         apiResponse.errorResponse(res, message.auth.invalidCredentials);
      }
  
      const token = jwt.sign(
        { userId: user?.id, email: user?.email,role: user?.role },
        jwtSecret!,
        { expiresIn: '1h' }
      );
  
      apiResponse.successResponse(res, { token }, message.auth.loginSuccess);
    } catch (error: any) {
      apiResponse.errorResponse(res, error.message || 'An unexpected error occurred');
    }
  };
  


export default { authRegister, authLogin };