import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()

const signIn = new UserController().signin
const signUp = new UserController().signUp

router.post('/auth/signin', signIn)
router.post('/auth/signup', signUp)

export { router }
