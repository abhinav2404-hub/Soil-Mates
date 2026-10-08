import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[ServerError]', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected server error occurred. Please try again.' : message,
    code: err.code || 'SERVER_ERROR'
  });
}
