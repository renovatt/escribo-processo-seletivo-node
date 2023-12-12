import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()
const userController = new UserController()

router.post('/auth/signin', userController.signIn)
router.post('/auth/signup', userController.signUp)

export { router }
