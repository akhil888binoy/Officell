import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import { userRouter } from "./routes/user.route";
import { ventRouter } from "./routes/vent.route";
import { companyRouter } from "./routes/company.route";
import { reportRouter } from "./routes/report.route";
import { commentRouter } from "./routes/comment.route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('combined'));
app.use(helmet());

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