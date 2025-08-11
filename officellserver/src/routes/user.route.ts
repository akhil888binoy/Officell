import express from 'express';
import { getUserProfile, loginUser, logoutUser, registerUser, verifyEmployment } from '../controllers/user.contoller';
export const userRouter = express.Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser );
userRouter.post("verify-employment", verifyEmployment);
userRouter.get("/profile/:id", getUserProfile);


