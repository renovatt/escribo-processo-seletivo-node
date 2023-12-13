import { ZodError } from 'zod'
import type { Response } from 'express'
import { ApiError, InternalError } from '.'

type ErrorResponse = {
  mensagem: string
}

export function handleZodError(
  error: ZodError,
  response: Response<ErrorResponse>,
) {
  const errorMessages = error.errors.map((err) => err.message).join(', ')
  return response.status(400).json({ mensagem: errorMessages })
}

export function handleError(error: Error | unknown, response: Response) {
  if (error instanceof ZodError) {
    handleZodError(error, response)
  } else if (error instanceof ApiError) {
    response.status(error.statusCode).json({ mensagem: error.message })
  } else {
    const internalError = new InternalError('Erro interno.')
    response
      .status(internalError.statusCode)
      .json({ mensagem: internalError.message })
  }
}
