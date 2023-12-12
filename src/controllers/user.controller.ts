/* eslint-disable camelcase */
import { Prisma } from '@prisma/client'
import prismaClient from '../lib/prisma'
import { UserProps } from '../@types'
import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

export class UserController {
  async signUp(request: Request, response: Response) {
    const { name, email, password, cellphones }: UserProps = request.body

    try {
      if (!name || !email || !password) {
        return response
          .status(400)
          .json({ error: 'Campos obrigatórios não fornecidos.' })
      }

      const userExists = await prismaClient.user.findUnique({
        where: {
          email,
        },
      })

      if (userExists) {
        return response
          .status(400)
          .json({ error: 'Já existe um usuário com este e-mail.' })
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

      const userController = new UserController()
      const accessToken = userController.generateAccessToken(newUSer.id)

      type UserWithToken = Omit<
        Prisma.UserCreateInput,
        'password' | 'email' | 'name' | 'cellphones'
      > & {
        token: string
      }

      const user: UserWithToken = {
        id: newUSer.id,
        created_at: newUSer.created_at,
        updated_at: newUSer.updated_at,
        last_login: newUSer.last_login,
        token: accessToken,
      }

      return response.status(201).json(user)
    } catch (error: any) {
      console.log(error)
      return response.status(500).json({ error: 'Erro interno.' })
    }
  }

  private generateAccessToken(userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET ?? '', {
      expiresIn: '8h',
    })
    return token
  }
}
