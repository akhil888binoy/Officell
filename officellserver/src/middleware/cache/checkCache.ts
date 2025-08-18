import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

export const redis = new Redis({
    port: 14896, 
    host: "redis-14896.c9.us-east-1-4.ec2.redns.redis-cloud.com", 
    username: 'default',
    password: process.env.REDIS_PASSWORD,
});

export const checkCacheCompany= async(req : Request , res: Response , next: NextFunction)=>{
    try {
        const {id} = req.params;
        const cacheCompanyData = await redis.get(`Company:${id}`);

        if(cacheCompanyData){
            res.json({
                message:"Cached Company",
                companies : cacheCompanyData
            });
        }else{
            next()
        }
    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}

export const checkCacheProfile = async( req: Request | any , res: Response, next: NextFunction)=>{
    try {
        const {_id} = req.decoded;
        const cacheProfile = await redis.get(`Profile:${_id}`);
        if(cacheProfile){
            res.json({
                message: "Cached Profile",
                user: cacheProfile
            });
        }else{
            next()
        }

    } catch (error: any ) {
        console.error(error);
        res.status(500).send(error.response.data);
    }
}



export const checkCacheVent = async (req: Request, res: Response , next: NextFunction)=>{
    try {
        const {id} = req.params;
        const cacheVentData = await redis.get(`Vent:${id}`);

        if(cacheVentData){
            res.json({
                message:"Cached Vent",
                companies : cacheVentData
            });
        }else{
            next()
        }
        
    } catch (error : any ) {
        console.error(error  );
        res.status(500).send(error.response.data)
    }
}

