import express from 'express';
import { addComment, createVent, deleteVent, downVote, getAllComment, getAllVents, getVent, reportVent, updateVent, upVote } from '../controllers/vent.controller';
import { auth } from '../middleware/auth';
import { validateData } from '../middleware/validation';
import { addCommentSchema, createVentSchema, reportVentSchema, updateVentSchema } from '../schemas/ventSchema';
import { checkCacheVent, redis } from '../middleware/cache/checkCache';
export const ventRouter = express.Router();

ventRouter.get("/vents", auth , getAllVents);
ventRouter.get("/vents/:id", auth , checkCacheVent,getVent);
ventRouter.post("/vents", auth , validateData(createVentSchema) , createVent);
ventRouter.put("/vents/:id", auth , validateData(updateVentSchema), updateVent);
ventRouter.delete("/vents/:id", auth , deleteVent);
ventRouter.post("/vents/:id/upvote", auth , upVote);
ventRouter.post("/vents/:id/downvote",auth ,  downVote);
ventRouter.post("/vents/:id/report", auth , validateData(reportVentSchema) , reportVent);
ventRouter.post("/vents/:id/comments", auth , validateData(addCommentSchema), addComment );
ventRouter.get("/vents/:id/comments", auth , getAllComment);

