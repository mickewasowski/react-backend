import { Request, Response, NextFunction } from 'express';

export const pageNotFound = async (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Page Not Found: '${req.originalUrl}'`);
  res.status(404);
  next(error);
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({ success: false, message: err.message });
  next('lala')
}
