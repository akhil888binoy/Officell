import {Request , Response } from 'express';
import { prisma } from "../index";
import { redisConnection } from '../redis/connection';
import geoip from 'geoip-lite';


export const getAllCompanies = async (req: Request , res : Response )=>{

    const { industry , company_name, skip} = req.query;
    const ip = req.ip; 
    const location = geoip.lookup("207.97.227.239");
    const country = location?.country; 
    console.log("County", country)
    try {

    const companies = await prisma.company.findMany({
        where : { 
            ...( company_name ? {
                    name: {
                        contains: String(company_name),
                        mode: 'insensitive'
                    } 
                } :{}),
            ...( industry ?  { 
                industry: String(industry)
            } :{})
        }, 
        include:{
            _count:{
                select:{vents: true}
            }
        },
        orderBy: [
                {
                    _relevance: {
                        fields: ['country'],
                        search: String(country),
                        sort: 'desc',
                    },
                },
                {
                    vents: {
                        _count: 'desc' 
                    }
                } 
            ],
            skip: Number(skip),
            take: 10
        });

    res.status(200).json({
        message: "Get Companies Successfull",
        companies : companies
    });
    } catch (error :any ) {
        console.error(error);
        res.status(500).json(error)
    }

}

export const getCompany = async (req: Request , res : Response )=>{
    const{id} = req.params;
    const redis = await redisConnection();
    
   try {
    const company = await prisma.company.findUnique({
        where:{id : Number(id)},
        include:{
            _count:{
                select:{vents: true}
            }
        },
    });
    await redis.set(`company:${id}`, JSON.stringify(company));
    await redis.expire(`company:${id}` , 3600);
    res.status(200).json({
        message: "Get Company Successfull",
        company:company
    });
   } catch (error : any ) { 
    console.error(error); 
    res.status(500).json(error);
   }

}

export const createCompany = async (req: Request , res : Response )=>{
    const redis = await redisConnection();
    const { 
        name , 
        domain ,  
        industry ,
        city , 
        country,
    } = req.body;
    
    try {

        const existing_company = await prisma.company.count({
            where:{
                name: name, 
                city: city,
                industry: industry,
                country: country
            }
        });   
        if(existing_company !=0 ){
            res.status(409).json({  
                message: "Company already exist"
            })
        }
        const add_company = await prisma.company.create({
            data:{
                name,
                domain,
                industry,
                city,
                country,
            }
        });

        const company = await prisma.company.findUnique({
            where:{id : Number(add_company.id)},
            include:{
                _count:{
                    select:{vents: true}
                }
            },
        });
        await redis.set(`company:${company?.id}`, JSON.stringify(company));
        await redis.expire(`company:${company?.id}` , 3600);
        res.status(201).json({
            message: "Add Company Successfull",
            company : company
        })
    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error);
    }

}
