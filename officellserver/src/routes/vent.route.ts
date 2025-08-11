import express from 'express';
import { createVent, deleteVent, downVote, getAllVents, getVent, reportVent, updateVent, upVote } from '../controllers/vent.controller';

export const ventRouter = express.Router();

ventRouter.get("/vents", getAllVents);
ventRouter.get("/vents/:id", getVent);
ventRouter.post("/vents", createVent);
ventRouter.put("/vents/:id", updateVent);
ventRouter.delete("/vents/:id", deleteVent);
ventRouter.post("/vents/:id/upvote", upVote);
ventRouter.post("/vents/:id/downvote", downVote);
ventRouter.post("/vents/:id/report", reportVent);

