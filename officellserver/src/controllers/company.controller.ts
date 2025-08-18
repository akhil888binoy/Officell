import {Request , Response } from 'express';
import { redis } from '../middleware/cache/checkCache';
import { prisma } from "../index";


export const getAllCompanies = async (req: Request , res : Response )=>{
    const {currentPage , pageSize , domain , company_name} = req.query;

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
            } : {})
        },
            take :  Number(pageSize) ,
            skip: Number(currentPage) * Number(pageSize),
            orderBy: { createdAt : 'desc'}
        });


    res.status(200).json({
        message: "Get Companies Successfull",
        companies : companies
    });

    } catch (error :any ) {
        console.error(error);
        res.status(500).send(error.response.data)
    }

}

export const getCompany = async (req: Request , res : Response )=>{
    const{id} = req.params;

   try {
    const company = await prisma.company.findUnique({
        where:{id : Number(id)}
    });
    await redis.set(`Company:${id}`, JSON.stringify(company),'EX', 3600);
    res.status(200).json({
        message: "Get Company Successfull",
        company:company
    });
   } catch (error : any ) {
    console.error(error);
    res.status(500).send(error.response.data);
   }

}

export const createCompany = async (req: Request , res : Response )=>{

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
        await redis.set(`Company:${add_company.id}`, JSON.stringify(add_company),'EX', 3600);
        res.status(201).json({
            message: "Add Company Successfull",
            company : add_company
        })
    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }

}
