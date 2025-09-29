import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../controllers/user.contoller';

export interface MyPayload extends JwtPayload {
    _id: number; 
}


export const auth = async (req: Request | any , res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        req.decoded = decoded;
        next();
    } catch (err) {
        const refreshToken = req.cookies.refreshToken;
        console.log("RefreshToken", refreshToken);
        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided.');
        }
        try {
            const decoded  = jwt.verify(refreshToken, SECRET_KEY) as MyPayload ;
            const token = jwt.sign({_id : decoded._id}, SECRET_KEY , {
                expiresIn: '1h',
            });
            res.cookie('Auth', token, {
                maxAge: 1 * 60 * 60 * 1000, // 60 minutes   
            });
            const decodedtoken = jwt.verify(token, SECRET_KEY);
            req.decoded = decodedtoken;
            next();
        } catch (error) {
                return res.status(400).send('Invalid refresh token.');
        }
    }
};
