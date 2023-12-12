import { AuthenticatedUser } from '../@types'
import { AuthService } from '../services/auth.service'
import { Request, Response, NextFunction } from 'express'
import { InternalError, UnauthorizedError } from '../errors'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  authenticateUser = async (
    request: Request & { user?: AuthenticatedUser },
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const token = request.header('Authorization')?.replace('Bearer ', '')

      if (!token) {
        const unauthorizedError = new UnauthorizedError('Não autorizado')
        return response
          .status(unauthorizedError.statusCode)
          .json({ mensagem: unauthorizedError.message })
      }

      const authProps = await this.authService.authenticateUser(token)

      if (!authProps) {
        const unauthorizedError = new UnauthorizedError(
          'Token inválido ou expirado',
        )
        return response
          .status(unauthorizedError.statusCode)
          .json({ mensagem: unauthorizedError.message })
      }

      request.user = authProps
      next()
    } catch (error) {
      const internalError = new InternalError('Erro interno.')
      return response
        .status(internalError.statusCode)
        .json({ mensagem: internalError.message })
    }
  }
}
