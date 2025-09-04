import {Request , Response } from 'express';
import { prisma } from "../index";
import { redisConnection } from '../redis/connection';
import path from 'path';
import { readFileSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';



export const getAllVents = async (req: Request , res : Response )=>{

    const {category , company_id, skip , author_id} = req.query;
    try {
        const vents = await prisma.vent.findMany({
    where: {
            ...(company_id ? { company_id: Number(company_id) } : {}),
            ...(category ? { category: String(category) } : {}),
            ...(author_id ? { author_id: Number(author_id) } : {}),
    },
    include: {
        votes:true,  
        company: {
            select: {
                name: true,
                country: true,
            },
        },
        _count: {
            select: { comments: true },
        },
        author:{
            select:{
                username: true
            }
        },
        Media:true
    },
        orderBy: [ 
            {
                createdAt: 'desc' 

            },
        ],
            skip: Number(skip),
            take: 10
        });

        res.status(200).json({
            message: "Get Vents Successful",
            vents: vents,
        })
    } catch (error : any ) {
        console.error(error );
        res.status(500).json(error);
    }

}

export const getAllTrendingVents = async(req:Request , res: Response)=>{
    try {
        const { skip } = req.query;
        const vents = await prisma.vent.findMany({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
            }
        },
    include: {
        votes:true,
            company: {
                select: {
                    name: true,
                    country: true,
                },
            },
            _count: {
                select: { comments: true },
            },
            author:{
                select:{
                    username: true
                }
            },
            Media:true
        },
        orderBy: [
            { upvote: 'desc' },      
            { createdAt: 'desc' }    
        ],
        take: 10,
        skip: Number(skip)
    });

    res.status(200).json({
            message: "Get Trending Vents Successful",
            vents: vents,
        });

    } catch (error: any ) {
        console.error(error);
        res.status(500).json(error)
    }
}


export const getVent = async (req: Request , res : Response )=> {
    const redis = await redisConnection();
    const {id } = req.params;
   
    try {
        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })

        await redis.set(`vent:${id}`, JSON.stringify(vent) );
        await redis.expire(`vent:${id}`, 3600);

        
        res.status(200).json({
            message: "Get Vent successfully",
            vent: vent
        });
    } catch (error: any ) {
        console.error(error);
        res.status(500).json(error);
    }
    
}


export const createVent = async (req: Request | any , res : Response )=> {
    const redis = await redisConnection();
    const {_id} = req.decoded;
    const {company_id, content, category} = req.body;

    try {
        
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cloud = await cloudinary.uploader.upload(dataURI, {
                    resource_type: "auto",
        });
        const create_vent = await prisma.vent.create({
                data:{
                    company_id: Number(company_id),
                    author_id: _id,
                    no_pii: true,
                    verified_employee:true, //TODO: Check for past companies in linkedin then decide true or false
                    content,
                    category,                    
                    upvote: 0,
                    downvote: 0,
            }
        });

        const media = await prisma.media.create({
            data:{
                vent_id: create_vent.id,
                type: 'IMAGE',
                url: cloud.url
            }
        });
        const vent = await prisma.vent.findUnique({
            where: {id : Number(create_vent.id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
        res.status(200).json({
            message: "Add Vent Successful",
            vent: vent,
            cloud
        });

    } catch (error : any ) {
        console.error(error)
        res.status(500).json(error)
    }
}

export const updateVent = async (req: Request | any , res : Response )=>{
            const redis = await redisConnection();

    const { id } = req.params;

    const {_id} = req.decoded;

    const { company_id , no_pii , content , category, media_url , media_type} = req.body;
    try {
        const update_vent = await prisma.vent.update({
            where: { id : Number(id) , author_id: _id },    
            data:{ 
                company_id: company_id ,
                no_pii: no_pii , 
                content: content , 
                category: category 
            }
        });
        const update_media = await prisma.media.updateMany({
            where:{
                vent_id: id 
            },
            data:{
                url: media_url,
                type: media_type
            }
        })
        await redis.set(`vent:${update_vent.id}`, JSON.stringify(update_vent));
        await redis.expire(`vent:${update_vent.id}`,3600);
        res.status(200).json({ 
            message : "Update vent Successfully",
            vent : update_vent
        } );

    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error);
    }
}

export const deleteVent = async (req: Request | any , res : Response )=>{
            const redis = await redisConnection();

    const { id } = req.params;
    const {_id} = req.decoded;

    try {
        const delete_vent = await prisma.vent.delete({
            where:{
                id : Number(id),
                author_id: _id
            }
        });
        await redis.del(`vent:${id}`);
        res.status(200).json({message : "Vent Deleted" , vent : delete_vent});
    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error);
    }
}

export const upVote = async (req: Request | any  , res : Response )=>{
    const redis = await redisConnection();
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
             // CASE 1
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

        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
            res.status(200).json({
                message : "Successfully NoVote",
                vote : add_vote,
                author_id : _id
            });

        }else if (existing_vote !== null && existing_vote.vote == 'DOWNVOTE'){
            // CASE 2
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

        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
            res.status(200).json({
                message : "Successfully NoVote",
                vote : add_vote,
                author_id : _id
            });
        }
        else if (existing_vote !== null && existing_vote.vote == 'NOVOTE' ){
            // CASE 3
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
            const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
            res.status(200).json({
                message : "Successfully Upvote",
                vote : add_vote,
                author_id : _id
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
        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
        res.status(200).json({
            message : "Successfully Upvote",
            vote : add_vote,
            author_id : _id
        });
    }


    } catch (error: any ) {
        console.error(error);
        res.status(500).json(error)
    }
}

export const downVote = async (req: Request | any , res : Response )=>{
    const redis = await redisConnection();
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

            const down_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'NOVOTE'
                }
            }); 
        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
            res.status(200).json({
                message: "Sucessfully NoVote",
                vote:down_vote,
                author_id : _id
            });

        }else if (existing_vote !== null && existing_vote.vote == 'UPVOTE'){
            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{downvote : {increment: 1} , upvote: {decrement: 1}}
            });

            const down_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'DOWNVOTE'
                }
            }); 
            const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
            res.status(200).json({
                message: "Sucessfully NoVote",
                vote:down_vote,
                author_id : _id
            });
        }
        else if (existing_vote !== null && existing_vote.vote =='NOVOTE'){
            const no_vote = await prisma.vent.update({
                where:{ id : Number(id) },
                data:{downvote : {increment: 1}}
            });

            const down_vote = await prisma.vote.updateMany({
                where : {
                    user_id: Number(_id),
                    vent_id: Number(id),
                },
                data:{
                    vote: 'DOWNVOTE'
                }
            }); 
        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
            res.status(200).json({
                message: "Sucessfully DownVote",
                vote: down_vote,
                author_id : _id
            });

        }else{

        const decrement_vote = await prisma.vent.update({
            where:{ id : Number(id) },
            data:{ downvote : {increment: 1}}
        });

        const down_vote = await prisma.vote.create({
            data:{
                vent_id: decrement_vote.id,
                user_id: _id,
                vote: 'DOWNVOTE'
            }
        });
        const vent = await prisma.vent.findUnique({
            where: {id : Number(id)},
            include:{
            votes:true,
            _count: {
                select: { comments: true },
            },
            company: {
                select: {
                    name: true,
                    country: true,
                },
            }, 
            author:{
                select:{
                    username: true
                }
            },
                comments:true,
                Media:true
            }
        })
        await redis.set(`vent:${vent?.id}`, JSON.stringify(vent));
        await redis.expire(`vent:${vent?.id}`, 3600);
        res.status(200).json({
            message : "Successfully DownVote",
            vote:down_vote,
            author_id : _id
        });
    }


    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error)
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
        res.status(500).json(error)
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
        res.status(500).json(error)
    }

}

export const getAllComment = async (req: Request , res : Response )=>{
    const { id } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: {vent_id : Number(id)},
            include:{
                subcomments: {
                    select:{
                        subcomment: true,
                        createdAt: true,
                        author: {
                            select:{
                                username: true
                            }
                        }
                    }
                },
                author:{
                    select:{
                        username: true,
                    }
                }
            }
        });

        res.status(200).json({
            message: "Get Comments Successfull",
            comments: comments
        });

    } catch (error: any ) {
        console.error(error);
        res.status(500).json(error);
    }

}