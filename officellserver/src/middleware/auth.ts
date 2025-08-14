import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_KEY } from '../controllers/user.contoller';





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
    res.status(401).send('Please authenticate');
    }
};
