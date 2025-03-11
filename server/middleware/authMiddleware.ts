import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from 'jsonwebtoken';

const jwtSecret: string = process.env.JWT_SECRET || 'slkdfjaslnvlksdlkjflksndlkmalkjskjsoiweoiuouewoijlkdfklasjdfkj';

export function verifyToken(req: Request, res: Response, next: NextFunction): void {

    const token = req.cookies.accessToken;

    if (!token) {
        res.status(401).json({ message: "Access Denied: No Token Provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret as string);
        (req as any).user = decoded; // Attach user info to request
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError){
            res.status(401).json({ message: "Token Expired" });
        }else{
            res.status(401).json({ message: "Invalid Token" });
        }
    }
};