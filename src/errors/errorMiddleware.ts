import { ApiError, InternalError } from '.'
import { NextFunction, Request, Response } from 'express'

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({ mensagem: error.message })
  }

  const internalError = new InternalError('Erro interno.')
  return response
    .status(internalError.statusCode)
    .json({ mensagem: internalError.message })
}
