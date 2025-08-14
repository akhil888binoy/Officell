import {Request , Response } from 'express';
import {  PrismaClient } from '../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate())


export const addSubcomment = async (req: Request | any , res: Response)=>{
    const {_id } = req.decoded;
    const { id } = req.params;
    const { subcomment } = req.body;
    try {
        const add_subcomment = await prisma.subComment.create({
            data:{
                comment_id: Number(id),
                author_id: Number(_id),
                subcomment: subcomment,
            }
        });
        res.status(201).json({
            message: "SubComment created",
            subcomment: add_subcomment
        });

    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }

}

export const deleteComment = async (req:Request | any , res: Response)=>{
    const{ id } = req.params;
    const{_id} = req.decoded;

    try {
        const delete_comment = await prisma.comment.delete({
            where:{id : Number(id), author_id: Number(_id)}
        });
        res.status(200).json({
            message: "Deleted Comment Successfully",
            deleted_comment: delete_comment
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}

export const deleteSubcomment= async ( req: Request | any , res: Response)=>{
    const{ id } = req.params;
    const{_id} = req.decoded;

    try {
        const delete_subcomment = await prisma.subComment.delete({
            where:{id : Number(id), author_id: Number(_id)}
        });
        res.status(200).json({
            message: "Deleted SubComment Successfully",
            deleted_subcomment: delete_subcomment
        });
    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}