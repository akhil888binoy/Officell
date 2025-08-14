import {Request , Response } from 'express';
import {  PrismaClient } from '../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate())


export const getReports= async (req: Request , res: Response)=>{
    const { currentPage , pageSize, category, report } = req.query;

    try {
        const reports = await prisma.reports.findMany({
            where : { category : String(category) , report: {contains: String(report)}},
            take :  Number(pageSize) ,
            skip: Number(currentPage) * Number(pageSize), 
        });
    } catch (error : any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}

