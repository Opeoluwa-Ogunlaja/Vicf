import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { AppError } from '../../utils/AppErrors'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not found ${req.originalUrl}. Check the url or request method`, 404)
  next(error)
}

// eslint-disable-next-line no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = !err.statusCode ? 500 : err.statusCode
  res.status(statusCode)
  res.json({
    success: false,
    message: err?.message,
    stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined
  })
}
