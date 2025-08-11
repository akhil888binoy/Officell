import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import { userRouter } from "./routes/user.route";
import { ventRouter } from "./routes/vent.route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());

app.get("/", (req ,res )=>{
    res.status(200).json({message : "Officell Server Running Successfully"})
});

app.use("/v1/user", userRouter);
app.use("/v1/post", ventRouter);


app.listen( PORT, ()=>{
    console.log(`🚀 Officell Server running on PORT : ${PORT} 📈`);
})