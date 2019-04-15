import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Secret } from "../configs/appConfig";
import { isArray } from "util";

export function authMidlleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Request URL:", req.originalUrl);

    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (isArray(token)) {
        token = token[0];
    }
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, Secret, (err, decoded) => {
            if (err) {
                res.sendStatus(401);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}
