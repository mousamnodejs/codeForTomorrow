import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import apiResponse from '../helper/api.response';

const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const combinedMessages = error.details
          .map(detail => detail.message.replace(/"/g, ''))
          .join(', ');
          
        apiResponse.badResponse(res, combinedMessages);
        return;
      }
    
    next();
  };
};

export default validateRequest;