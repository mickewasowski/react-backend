import express from 'express';
import { login, register, getAll } from '../controllers/UserController';

const router = express.Router();

router.route("/").get(getAll);
router.post("/login", login);
router.post("/register", register);

export default router;