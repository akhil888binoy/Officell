import {Request , Response } from 'express';
import axios from 'axios';
import {  PrismaClient } from '../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const REDIRECT_URI = 'http://localhost:3000/v1/auth/linkedin/callback';
const prisma = new PrismaClient().$extends(withAccelerate())

export const SECRET_KEY : jwt.Secret = 'SECRETKEYJSON';

export const authLinkedin = (req: Request , res : Response )=>{
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=123456&scope=profile%20email%20openid`;
    res.redirect(linkedinAuthUrl);
}

export const authLinkedinCallback = async (req: Request , res : Response )=>{
        const code = req.query.code;
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
    const accessToken = tokenResponse.data.access_token;

    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = profileResponse.data;

    const user = await prisma.user.findUnique({
        where:{linkedin_id : String(profileResponse.data.sub)}
    });


    if (user == null){

        const add_user = await prisma.user.create({
            data : {
                linkedin_id: data.sub,
                email: data.email,
            }
        });
        const token = jwt.sign({ _id: add_user.id }, SECRET_KEY, {
                expiresIn: '2 days',
        });
        res.cookie('auth', token , {
            maxAge: 1800000, // 30 minutes   
            httpOnly: true,
        });
        res.json("Not  exist")
    }

    const token = jwt.sign({_id : user?.id}, SECRET_KEY , {
        expiresIn: '2 days',
    })
    
        res.cookie('auth', token , {
            maxAge: 1800000, // 30 minutes   
            httpOnly: true,
        });
        res.json("Already exist")

    } catch (error: any ) {
        res.status(500).send(error.response.data);
    }
}

export const getUserProfile = async (req: Request | any  , res : Response ) => {
    const { _id } = req.decoded;
    try {
        const user = await prisma.user.findUnique({
            where:{id : _id}
        });
        
        if (user !== null){
            res.status(200).json({
            message : "Get Profile Successfull",
            user : user
            }); 
        }

        res.status(401).json({
                message : "User doesnt exist ",
                id : _id
            }); 

    } catch (error: any ) {
        res.status(500).send(error.response.data);
    }
}

export const addUsername = async (req: Request | any  , res : Response ) => {
    const { _id } = req.decoded;
    const {new_username} = req.body;
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
            res.status(200).json({
                message : "Update Username Successfull",
                user : user
            }); 
        }
        res.status(500).json({
            message: "Username already exist"
        });

    } catch (error: any ) {
        res.status(500).send(error.response.data);
    }
}

export const logoutUser = async (req: Request | any , res : Response )=>{
    try {
        res.clearCookie('auth');
        res.redirect("/");
        res.status(200).json({message : "User Logged out Successfull"});

    } catch (error : any ) {
        console.error(error); 
        res.status(500).send(error.response.data)
    }
}


