// src/middleware/jwtAuthMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import apiResponse from '../helper/api.response';
import message from '../helper/message';

const secretKey = process.env.JWT_SECRET as string;

// -- Custom Request Type to include user --
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

const AuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token) {
    apiResponse.unauthorizedResponse(res, message.auth.tokenMissing);
    return;
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      apiResponse.forbiddenResponse(res, message.auth.tokenInvalid);
      return;
    }

    // Type safety: decoded might be a string or JwtPayload
    const payload = decoded as JwtPayload;

    if (!payload || typeof payload !== 'object') {
      apiResponse.forbiddenResponse(res, message.auth.tokenInvalid);
      return;
    }

    // Attach user to request
    req.user = {
      userId: payload.userId,
     role: payload.role,
    };
    if (!['ADMIN', 'HR'].includes(payload.role)) {
        apiResponse.forbiddenResponse(res, message.auth.accessDenied);
        return;
      }
      

    next();
  });
};

export default AuthMiddleware;
