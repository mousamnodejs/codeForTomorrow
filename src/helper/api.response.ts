import { Response } from 'express';

// Success Response
const successResponse = (res: Response, data: any, message?: string): Response => {
  return res.status(200).json({
    status: true,
    message: message || 'Request was successful',
    data: data || null,
  });
};

// Error Response
const errorResponse = (res: Response, message: string, statusCode: number = 500): Response => {
  return res.status(statusCode).json({
    status: 'error',
    message: message || 'An error occurred',
  });
};

// Validation Error Response
const validationErrorResponse = (res: Response, message: string): Response => {
  return res.status(400).json({
    status: 'error',
    message: message || 'Validation failed',
  });
};

// Not Found Response
const notFoundResponse = (res: Response, message: string): Response => {
  return res.status(404).json({
    status: 'error',
    message: message || 'Resource not found',
  });
};

// Unauthorized Response
const unauthorizedResponse = (res: Response, message: string): Response => {
  return res.status(401).json({
    status: 'error',
    message: message || 'Unauthorized access',
  });
};

// Forbidden Response
const forbiddenResponse = (res: Response, message: string): Response => {
  return res.status(403).json({
    status: 'error',
    message: message || 'Forbidden',
  });
};

// Created Response
const createdResponse = (res: Response, data: any, message?: string): Response => {
  return res.status(201).json({
    status: 'success',
    message: message || 'Resource created successfully',
    data: data || null,
  });
};

// Bad Response
const badResponse = (res: Response, message: string, statusCode: number = 400): Response => {
  return res.status(statusCode).json({
    status: 'error',
    message: message || 'Bad request or invalid data',
  });
};

const  joivalidationErrorResponse = (res: Response, message: string [],statusCode:number=400): Response => {
  return res.status(statusCode).json({
    status: false,
    message: message || 'Validation failed',
  });
}
// Exporting the functions to use in other parts of your app
export default {
  joivalidationErrorResponse,
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  createdResponse,
  badResponse
};
