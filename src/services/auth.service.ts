import jwt from 'jsonwebtoken'
import { TokenPayload } from '../@types'

export class AuthService {
  async authenticateUser(token: string): Promise<TokenPayload | null> {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET ?? '',
      ) as TokenPayload
      return decodedToken
    } catch (error) {
      return null
    }
  }
}
