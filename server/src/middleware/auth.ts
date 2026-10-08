import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { store } from '../models/store';
import { UserRole } from '../models/User';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  // Quick demo token support for instant testing & seamless preview
  if (token.startsWith('demo-')) {
    const rolePart = token.replace('demo-', '').toUpperCase();
    const role: UserRole = ['FARMER', 'BUYER', 'VENDOR', 'ADMIN'].includes(rolePart)
      ? (rolePart as UserRole)
      : 'BUYER';

    req.user = {
      id: `usr-${role.toLowerCase()}-1`,
      name:
        role === 'FARMER'
          ? 'Ramesh Patel'
          : role === 'VENDOR'
          ? 'Rajesh Agrawal'
          : role === 'ADMIN'
          ? 'Soil Mates Admin'
          : 'Priya Sharma',
      email: `${role.toLowerCase()}@soilmates.in`,
      role
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.authSecret) as any;
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };
    return next();
  } catch (err) {
    // Invalid token, continue unauthenticated
    return next();
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to continue.'
    });
  }
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
