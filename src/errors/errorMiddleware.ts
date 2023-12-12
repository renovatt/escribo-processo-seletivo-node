import { ApiError, InternalError } from '.'
import { NextFunction, Request, Response } from 'express'

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ mensagem: error.message })
  }

  const internalError = new InternalError('Erro interno.')
  return res
    .status(internalError.statusCode)
    .json({ mensagem: internalError.message })
}
