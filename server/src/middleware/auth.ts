import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import express from 'express';

interface CustomRequest extends Request {
  user?: JwtPayload; // Extend the Request object to include a user property
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // Retrieve the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token (Bearer <token>)

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'; // Use environment variable or default key
    const decoded = jwt.verify(token, secretKey) as JwtPayload; // Verify and decode the token

    req.user = decoded; // Attach decoded user data to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ message: 'Access token is invalid or expired' });
  }
};

