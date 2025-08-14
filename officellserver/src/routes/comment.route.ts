import express from 'express';
import { addSubcomment, deleteComment, deleteSubcomment } from '../controllers/comment.controller';
import { auth } from '../middleware/auth';

export const commentRouter = express.Router();

commentRouter.post("/comments/:id/subcomments", auth , addSubcomment);
commentRouter.delete("/comments/:id",  auth , deleteComment);
commentRouter.delete("/subcomments/:id", auth ,  deleteSubcomment);