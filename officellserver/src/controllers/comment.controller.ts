import {Request , Response } from 'express';
import { prisma } from "../index";


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
        res.status(500).json(error);
    }

}

export const getAllSubcomments = async (req: Request, res: Response )=>{
    const {id } = req.params;
    try {
        const subcomments = await prisma.subComment.findMany({
            where:{
                comment_id: Number(id)
            }
        })
        res.status(201).json({
            message: "SubComments",
            subcomments: subcomments
        });
    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error);
    }
}
export const updateSubcomment= async(req: Request | any , res: Response)=>{
    const{id} = req.params;
    const{_id} = req.decoded;
    const {subcomment} = req.body;
    try {
        const update_subcomment = await prisma.subComment.update({
            where:{id : Number(id) , author_id: Number(_id)},
            data:{
                subcomment: subcomment
            }
        });

        res.status(200).json({
            "message":"Updated Subcomment",
            "subcomment": update_subcomment
        });
    } catch (error: any ) {
        console.error(error);
        res.status(500).json(error)
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
        res.status(500).json(error);
    }
}


export const updateComment = async(req: Request | any , res: Response)=>{
    const {id} = req.params;
    const {_id} = req.decoded;
    const {comment}=req.body;
    try {
        const update_comment= await prisma.comment.update({ 
            where:{id: Number(id), author_id: Number(_id)},
            data:{
                comment:String(comment)
            }
        });
        res.status(200).json({
            message:"Update Comment",
            comment:update_comment
        });
    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error);
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
        res.status(500).json(error);
    }
}

