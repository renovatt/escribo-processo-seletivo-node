import { Router } from 'express'
import { UserController } from '../controllers/user.controller'

const router = Router()

const signUp = new UserController().signUp

router.post('/auth/signin')
router.post('/auth/signup', signUp)

export { router }
