import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/user.service'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  signIn = async (request: Request, response: Response, next: NextFunction) => {
    try {
      await this.userService.signIn(request.body, response)
    } catch (error) {
      next(error)
    }
  }

  signUp = async (request: Request, response: Response, next: NextFunction) => {
    try {
      await this.userService.signUp(request.body, response)
    } catch (error) {
      next(error)
    }
  }
}
