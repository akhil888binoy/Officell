import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { userRouter } from "./routes/user.route";
import { ventRouter } from "./routes/vent.route";
import { companyRouter } from "./routes/company.route";
import { reportRouter } from "./routes/report.route";
import { commentRouter } from "./routes/comment.route";
import {  PrismaClient } from './generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createClient } from "redis";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient().$extends(withAccelerate())
export const client = createClient({
        username: 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: 'redis-16198.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
            port: 16198,
        }
    });

app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors())
app.get("/", (req ,res )=>{
    res.status(200).json({message : "Officell Server Running Successfully"});
});


app.use("/v1/", userRouter);
app.use("/v1/", ventRouter);
app.use("/v1/", companyRouter);
app.use("/v1/", reportRouter);
app.use("/v1/", commentRouter);


app.listen( PORT, ()=>{
    console.log(`🚀 Officell Server running on PORT : ${PORT} 📈`);
})