import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { AuthController } from '../controllers/auth.controller'

const router = Router()
const userController = new UserController()
const meController = new AuthController()

router.post('/auth/signin', userController.signIn)
router.post('/auth/signup', userController.signUp)
router.get('/users/me/:id', meController.authenticateUser, userController.me)

export { router }
