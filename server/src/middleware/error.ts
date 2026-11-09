import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    (err.message && (err.message.includes('buffering timed out') || err.message.includes('topology was destroyed')))
  ) {
    console.warn('[AI Studio] Database offline — returning mock/empty response gracefully');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ success: false, error: 'Service temporarily operating in resilient in-memory mode' });
  }

  console.error('[ServerError]', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'An unexpected server error occurred. Please try again.' : message,
    code: err.code || 'SERVER_ERROR'
  });
}
