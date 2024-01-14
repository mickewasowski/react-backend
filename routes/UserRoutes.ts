import express from 'express'
import { login, register, getAll, updateUser } from '../controllers/UserController'

const router = express.Router()

router.route("/").get(getAll).patch(updateUser)
router.post("/login", login)
router.post("/register", register)

export default router