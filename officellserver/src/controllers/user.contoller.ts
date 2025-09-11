import {Request , Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prisma } from "../index";
import { redisConnection } from '../redis/connection';
import geoip from 'geoip-lite';

const REDIRECT_URI = 'http://localhost:3000/v1/auth/linkedin/callback';


export const SECRET_KEY : jwt.Secret = 'SECRETKEYJSON';


export const authLinkedin = (req: Request , res : Response )=>{
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=123456&scope=profile%20email%20openid`;
    res.redirect(linkedinAuthUrl);
}

export const authLinkedinCallback = async (req: Request , res : Response )=>{
    const code = req.query.code;

    const redis = await redisConnection();

    try {

    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            },
    });

    const accessToken = tokenResponse?.data.access_token;

    console.log("Access Token", accessToken);

    const profileResponse: any  = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = profileResponse?.data;
    console.log("Data",data);
    const user = await prisma.user.findUnique({
        where:{linkedin_id : String(data.sub)}
    });

    if (user == null){

        const add_user = await prisma.user.create({
            data : {
                linkedin_id: data.sub,
                email: data.email,
            }
        });
        const token = jwt.sign({ _id: add_user.id }, SECRET_KEY, {
                expiresIn: '1d',
        });

        await redis.set(`Profile:${add_user.id}`, JSON.stringify(add_user));
        await redis.expire(`Profile:${add_user.id}` , 3600);

        res.cookie('Auth', token , {
            maxAge: 24 * 60 * 60 * 1000, // 30 minutes   
            
        });

        res.redirect("http://localhost:5173/username")

    }else{

        const token = jwt.sign({_id : user?.id}, SECRET_KEY , {
            expiresIn: '1d',
        });

        await redis.set(`Profile:${user?.id}`, JSON.stringify(user));
        await redis.expire(`Profile:${user?.id}` , 3600);


        res.cookie('Auth', token, {
                maxAge: 24 * 60 * 60 * 1000, // 30 minutes   
                
        });

        res.redirect("http://localhost:5173/feed")
    }

    } catch (error: any) {
        res.status(500).json({error: error});
    }
}

export const getUserProfile = async (req: Request | any  , res : Response ) => {
    const { _id } = req.decoded;
    const redis = await redisConnection();
    const ip = req.ip;
    const location = geoip.lookup("207.97.227.239");
    try {
        const user = await prisma.user.findUnique({
            where:{id : _id}
        });

        if (user !== null){

            await redis.set(`Profile:${_id}`, JSON.stringify(user));
            await redis.expire(`Profile:${_id}`, 3600);

            res.status(200).json({
                message : "Get Profile Successfull",
                user : user,
                location: location
            }); 

        }else{
                res.status(401).json({
                message : "User doesn't exist",
                id : _id
            }); 
        }

    } catch (error: any ) {
        res.status(500).json(error);
    }
}

export const addUsername = async (req: Request | any  , res : Response ) => {
    const { _id } = req.decoded;
    const {new_username} = req.body;
    const redis = await redisConnection();

    try {
        const existing_username = await prisma.user.findUnique({
            where: {username: new_username}
        });

        if (existing_username == null){
            const user = await prisma.user.update({
                where: {id : _id},
                    data:{
                        username: new_username
                    }
            });
            await redis.set(`Profile:${_id}`, JSON.stringify(user));
            await redis.expire(`Profile:${_id}` , 3600);
            res.status(200).json({
                message : "Update Username Successfull",
                user : user
            }); 
        }
        res.status(500).json({
            message: "Username already exist"
        });

    } catch (error: any ) {
        res.status(500).json(error);
    }
}

export const logoutUser = async (req: Request | any , res : Response )=>{
    try {
        res.clearCookie('auth');
        res.redirect("/");
        res.status(200).json({message : "User Logged out Successfull"});

    } catch (error : any ) {
        console.error(error); 
        res.status(500).json(error)
    }
}


