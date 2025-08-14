import express from 'express';
import { getUserProfile, logoutUser, authLinkedin, authLinkedinCallback, addUsername } from '../controllers/user.contoller';
import { auth } from '../middleware/auth';
export const userRouter = express.Router();


userRouter.get("/auth/linkedin", authLinkedin);
userRouter.get("/auth/linkedin/callback", authLinkedinCallback);
userRouter.post("/logout", auth , logoutUser );
userRouter.get("/profile", auth, getUserProfile);
userRouter.post("/add-username", auth , addUsername);


