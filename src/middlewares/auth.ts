import { Request, Response, NextFunction } from "express";

export function authMidlleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Request URL:", req.originalUrl);
    next();
}
