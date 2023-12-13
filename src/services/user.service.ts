import jwt from 'jsonwebtoken'
import { Response } from 'express'
import { compare, hash } from 'bcryptjs'
import prismaClient from '../lib/prisma'
import { PrismaClient } from '@prisma/client'
import { UserWithToken } from '../@types'
import { handleError } from '../errors/zod.validation'
import { BadRequesError } from '../errors'
import {
  UserSchemaProps,
  loginSchema,
  loginSchemaProps,
  userSchema,
} from '../zod'

export class UserService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prismaClient
  }

  async signIn(body: loginSchemaProps, response: Response) {
    try {
      const validatedData = loginSchema.parse(body)
      const { email, password } = validatedData

      const user = await this.prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new BadRequesError('Usuário e/ou senha inválidos')
      }

      const passwordMatcher = await compare(password, user.password)

      if (!passwordMatcher) {
        throw new BadRequesError('Usuário e/ou senha inválidos')
      }

      const accessToken = this.generateAccessToken(user.id)

      const authenticatedUser: UserWithToken = {
        id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: new Date(Date.now()),
        token: accessToken,
      }

      return response.status(200).json(authenticatedUser)
    } catch (error) {
      handleError(error, response)
    }
  }

  async signUp(body: UserSchemaProps, response: Response) {
    try {
      const validatedData = userSchema.parse(body)
      const { name, email, password, cellphones } = validatedData

      if (!name || !email || !password) {
        throw new BadRequesError('Campos obrigatórios não fornecidos.')
      }

      if (cellphones && cellphones.length === 0) {
        throw new BadRequesError('Campos de telefone não podem ser vazios.')
      }

      for (const phone of cellphones) {
        if (!phone.number || !phone.ddd) {
          throw new BadRequesError('Campos de telefone não podem ser vazios.')
        }
      }

      const userExists = await prismaClient.user.findUnique({
        where: {
          email,
        },
      })

      if (userExists) {
        throw new BadRequesError('Já existe um usuário com este e-mail.')
      }

      const passwordHashed = await hash(password, 12)

      const newUSer = await prismaClient.user.create({
        data: {
          name,
          email,
          password: passwordHashed,
          last_login: new Date(Date.now()),
          cellphones,
        },
      })

      const accessToken = this.generateAccessToken(newUSer.id)

      const user: UserWithToken = {
        id: newUSer.id,
        created_at: newUSer.created_at,
        updated_at: newUSer.updated_at,
        last_login: newUSer.last_login,
        token: accessToken,
      }

      return response.status(201).json(user)
    } catch (error) {
      handleError(error, response)
    }
  }

  async me(id: string, response: Response) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        throw new BadRequesError('Usuário não encontrado')
      }

      const authenticatedUser: Omit<UserSchemaProps, 'password'> = {
        id: user.id,
        name: user.name,
        email: user.email,
        cellphones: user.cellphones,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
      }

      return response.status(200).json(authenticatedUser)
    } catch (error) {
      handleError(error, response)
    }
  }

  private generateAccessToken(userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET ?? '', {
      expiresIn: '30m',
    })
    return token
  }
}
