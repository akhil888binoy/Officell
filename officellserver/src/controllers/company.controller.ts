import {Request , Response } from 'express';
import { prisma } from "../index";
import { redisConnection } from '../redis/connection';
import geoip from 'geoip-lite';


export const getAllCompanies = async (req: Request , res : Response )=>{

    const { domain , company_name, skip} = req.query;
    const ip = req.ip;
    const location = geoip.lookup("207.97.227.239");
    const country = location?.country;
    
    try {

    const companies = await prisma.company.findMany({
        where : { 
            ...( company_name ? {
                    name: {
                        contains: String(company_name),
                        mode: 'insensitive'
                    }
                }
            : domain ?  {
                domain: String(domain)
            } : country ?  {
                country: String(country)
            }  :{})
        },
            orderBy: {
                vents:{
                    _count:'desc'
                }
            },
            skip: Number(skip),
            take: 5
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
        where:{id : Number(id)}
    });
    await redis.set(`Company:${id}`, JSON.stringify(company));
    await redis.expire(`Company:${id}` , 3600);
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
        google_place_id , 
        name , 
        domain , 
        industry ,
        branch_name , 
        formatted_address , 
        city , 
        state,
        country,
        lat,
        lng,
    } = req.body;
    
    try {

        const existing_company = await prisma.company.findUnique({
            where: {google_place_id : google_place_id}
        });

        if (existing_company !==null){
            res.status(401).json({message : "Company already exist"});
        }   

        const add_company = await prisma.company.create({
            data:{
                google_place_id,
                name,
                domain,
                industry,
                branch_name,
                formatted_address,
                city,
                state,
                country,
                lat,
                lng
            }
        });
        await redis.set(`Company:${add_company.id}`, JSON.stringify(add_company));
        await redis.expire(`Company:${add_company.id}` , 3600);
        res.status(201).json({
            message: "Add Company Successfull",
            company : add_company
        })
    } catch (error : any ) {
        console.error(error);
        res.status(500).json(error);
    }

}
