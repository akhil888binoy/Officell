import {Request , Response } from 'express';

export const getHello = (req: Request , res : Response )=>{

    res.status(200).json({
        message: "Hello World"
    })

}