import express from 'express';
import { getHello } from '../controllers/user.contoller';

export const userRouter = express.Router();


userRouter.get("/hello", getHello)


