/* eslint-disable camelcase */
import { Prisma } from '@prisma/client'
import prismaClient from '../lib/prisma'
import { UserProps, UserWithToken } from '../@types'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

export class UserController {
  async signin(request: Request, response: Response) {
    const { email, password }: UserProps = request.body

    const user = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!user) {
      return response
        .status(400)
        .json({ error: 'Usuário e/ou senha inválidos&quot' })
    }

    const passwordMatcher = await compare(password, user.password)

    if (!passwordMatcher) {
      return response
        .status(400)
        .json({ error: 'Usuário e/ou senha inválidos&quot' })
    }

    const userController = new UserController()
    const accessToken = userController.generateAccessToken(user.id)

    const authenticatedUser: UserWithToken = {
      id: user.id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      token: accessToken,
    }

    return response.status(200).json(authenticatedUser)
  }

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
