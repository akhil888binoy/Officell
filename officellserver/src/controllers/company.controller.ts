import {Request , Response } from 'express';
import {  PrismaClient } from '../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate())


export const getAllCompanies = async (req: Request , res : Response )=>{
    const {currentPage , pageSize , domain , company_name} = req.query;

    try {

    const companies = await prisma.company.findMany({
        where:{
            domain : String(domain) ,  
            name:{contains: String(company_name)}
        },
        take: Number(pageSize),
        skip: Number(currentPage) * Number(pageSize),
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

        const existing_company = await prisma.company.findMany({
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
        res.status(201).json({
            message: "Add Company Successfull",
            company : add_company
        })
    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }

}
