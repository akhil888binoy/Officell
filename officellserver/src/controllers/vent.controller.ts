import {Request , Response } from 'express';
import { redis } from '../middleware/cache/checkCache';
import { prisma } from "../index";

export const getAllVents = async (req: Request , res : Response )=>{

    const {currentPage , pageSize , category , company_id } = req.query;
    
    try {
        const vents = await prisma.vent.findMany({
            where : { 
                ...( company_id ? {
                    company_id: Number(company_id)
                }
            : category ?  {
                category: String(category)
            } :{})
        },
            take :  Number(pageSize) ,
            skip: Number(currentPage) * Number(pageSize),
            orderBy: {createdAt : 'desc'}
        });
        
        res.status(200).json({
            message: "Get Vents Successful",
            current_page: currentPage,
            page_size: pageSize,
            vents: vents,
        })
    } catch (error : any ) {
        console.error(error );
        res.status(500).send(error.response.data);
    }

}

export const getVent = async (req: Request , res : Response )=> {

    const {id } = req.params;

    try {
        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)}
        })

        await redis.set(`Vent:${id}`, JSON.stringify(vent), 'EX', 3600);
        res.status(200).json({
            message: "Get Vent successfully",
            vent: vent
        });
    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
    
}

export const createVent = async (req: Request | any , res : Response )=> {
    const {_id} = req.decoded;
    const {company_id , no_pii , verified_employee, content , category} = req.body;

    try {

        const vent = await prisma.vent.create({
                data:{
                    company_id,
                    author_id: _id,
                    no_pii,
                    verified_employee, //TODO: Check for past companies in linkedin then decide true or false
                    content,
                    category,
                    upvote: 0,
                    downvote: 0,
            }
        });
        await redis.set(`Vent:${vent.id}`, JSON.stringify(vent), 'EX', 3600);

        res.status(200).json({
            message: "Add Vent Successful",
            vent: vent
        });

    } catch (error : any ) {
        console.error(error)
        res.status(500).send(error.response.data)
    }
}

export const updateVent = async (req: Request | any , res : Response )=>{
    const { id } = req.params;

    const {_id} = req.decoded;

    const { company_id , no_pii , content , category} = req.body;
    try {
        const update_vent = await prisma.vent.update({
            where: { id : Number(id) , author_id: _id },    
            data:{ company_id: company_id , no_pii: no_pii , content: content , category: category}
        });
        await redis.set(`Vent:${update_vent.id}`, JSON.stringify(update_vent), 'EX', 3600);
        res.status(200).json({ 
            message : "Update vent Successfully",
            vent : update_vent
        } );

    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}

export const deleteVent = async (req: Request | any , res : Response )=>{
    const { id } = req.params;
    const {_id} = req.decoded;

    try {
        const delete_vent = await prisma.vent.delete({
            where:{
                id : Number(id),
                author_id: _id
            }
        });
        await redis.del(`Vent:${delete_vent.id}`);
        res.status(200).json({message : "Vent Deleted" , vent : delete_vent});
    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}

export const upVote = async (req: Request | any  , res : Response )=>{
    const { id } = req.params;
    const {_id } = req.decoded;
    try {
        const existing_vote = await prisma.vote.findFirst({
            where : {
                user_id: Number(_id),
                vent_id: Number(id),
            }
        });
        
        if (existing_vote !== null && existing_vote.vote == 'UPVOTE'){

            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{upvote : {decrement: 1}}
            });

            const add_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'NOVOTE'
                }
            });
            await redis.set(`Vent:${no_vote.id}`, JSON.stringify(no_vote), 'EX', 3600);

            res.status(200).json({
                message : "Successfully NoVote",
                vent : no_vote
            });

        }else if (existing_vote !== null && existing_vote.vote == 'DOWNVOTE'){
            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{upvote : {increment: 1} , downvote : {decrement : 1}}
            });

            const add_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'UPVOTE'
                }
            });

            await redis.set(`Vent:${no_vote.id}`, JSON.stringify(no_vote), 'EX', 3600);
            res.status(200).json({
                message : "Successfully NoVote",
                vent : no_vote
            });
        }
        else if (existing_vote !== null && existing_vote.vote == 'NOVOTE' ){
            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{upvote : {increment: 1}}
            });

            const add_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'UPVOTE'
                }
            });
            await redis.set(`Vent:${no_vote.id}`, JSON.stringify(no_vote), 'EX', 3600);
            res.status(200).json({
                message : "Successfully Upvote",
                vent : no_vote
            });
        }
        else{

        const incremet_vote = await prisma.vent.update({
            where:{ id : Number(id) },
            data:{upvote : {increment: 1}}
        });

        const add_vote = await prisma.vote.create({
            data:{
                vent_id: incremet_vote.id,
                user_id: _id,
                vote: 'UPVOTE'
            }
        });
        await redis.set(`Vent:${incremet_vote.id}`, JSON.stringify(incremet_vote), 'EX', 3600);
        res.status(200).json({
            message : "Successfully Upvote",
            vent : incremet_vote
        });
    }


    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data)
    }
}

export const downVote = async (req: Request | any , res : Response )=>{
    const { id } = req.params;
    const {_id } = req.decoded;

    try {

        const existing_vote = await prisma.vote.findFirst({
                where: {
                user_id: Number(_id),
                vent_id: Number(id),
            }
        });
        
        
        if (existing_vote !== null && existing_vote.vote =='DOWNVOTE'){

            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{downvote : {decrement: 1}}
            });

            const add_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'NOVOTE'
                }
            }); 
            await redis.set(`Vent:${no_vote.id}`, JSON.stringify(no_vote), 'EX', 3600);
            
            res.status(200).json({
                message: "Sucessfully NoVote"
            });

        }else if (existing_vote !== null && existing_vote.vote == 'UPVOTE'){
            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{downvote : {increment: 1} , upvote: {decrement: 1}}
            });

            const add_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'NOVOTE'
                }
            }); 
            await redis.set(`Vent:${no_vote.id}`, JSON.stringify(no_vote), 'EX', 3600);
            res.status(200).json({
                message: "Sucessfully NoVote"
            });
        }
        else if (existing_vote !== null && existing_vote.vote =='NOVOTE'){
            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{downvote : {increment: 1}}
            });

            const add_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'DOWNVOTE'
                }
            }); 
            await redis.set(`Vent:${no_vote.id}`, JSON.stringify(no_vote), 'EX', 3600);

            res.status(200).json({
                message: "Sucessfully NoVote"
            });

        }else{

        const decrement_vote = await prisma.vent.update({
            where:{ id : Number(id) },
            data:{ downvote : {increment: 1}}
        });

        const add_vote = await prisma.vote.create({
            data:{
                vent_id: decrement_vote.id,
                user_id: _id,
                vote: 'DOWNVOTE'
            }
        });
        await redis.set(`Vent:${decrement_vote.id}`, JSON.stringify(decrement_vote), 'EX', 3600);

        res.status(200).json({
            message : "Successfully DownVote",
            vent : decrement_vote
        });
    }


    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data)
    }
}

export const reportVent = async (req: Request | any  , res : Response )=>{
    const {id } = req.params;
    const {_id} = req.decoded;
    const {report , category} = req.body;
    try {
    const add_report = await prisma.reports.create({
            data:{
                vent_id: Number(id),
                reporter_id: _id,
                report,
                category
            }
        });
        res.status(200).json({
            message : "Report Add Successfull",
            report : add_report
        });
    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data)
    } 

}

export const addComment = async (req: Request  | any , res : Response )=>{

    const{ comment } = req.body;
    const {id} = req.params;
    const {_id} = req.decoded;

    try {
        const add_comment = await prisma.comment.create({
            data:{
                vent_id : Number(id ),
                author_id: _id,
                comment
            }
        });
        res.status(200).json({
            message : "Add Comment Successfull",
            comment : add_comment
        });

    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data)
    }

}

export const getAllComment = async (req: Request , res : Response )=>{
    const { id } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: {vent_id : Number(id)}
        });

        res.status(200).json({
            message: "Get Comments Successfull",
            comments: comments
        });

    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }

}