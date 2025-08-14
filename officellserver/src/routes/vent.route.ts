import express from 'express';
import { addComment, createVent, deleteVent, downVote, getAllComment, getAllVents, getVent, reportVent, updateVent, upVote } from '../controllers/vent.controller';
import { auth } from '../middleware/auth';

export const ventRouter = express.Router();

ventRouter.get("/vents", auth , getAllVents);
ventRouter.get("/vents/:id", auth , getVent);
ventRouter.post("/vents", auth , createVent);
ventRouter.put("/vents/:id", auth , updateVent);
ventRouter.delete("/vents/:id", auth , deleteVent);
ventRouter.post("/vents/:id/upvote", auth , upVote);
ventRouter.post("/vents/:id/downvote",auth ,  downVote);
ventRouter.post("/vents/:id/report", auth , reportVent);
ventRouter.post("/vents/:id/comments",auth , addComment );
ventRouter.get("/vents/:id/comments", auth ,getAllComment);

