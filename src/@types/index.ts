import { Prisma } from '@prisma/client'
import { UserSchemaProps } from '../zod'

export type UserWithToken = Omit<
  Prisma.UserCreateInput,
  'password' | 'email' | 'name' | 'cellphones'
> & {
  token: string
}

export interface TokenPayload {
  userId: string
}

export type AuthenticatedUser = TokenPayload & Partial<UserSchemaProps>
