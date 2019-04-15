import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Secret } from "../configs/appConfig";
import { isArray } from "util";
import { RequestWithPayload } from "../models/model";

export function authMidlleware(
    req: RequestWithPayload,
    res: Response,
    next: NextFunction
) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (isArray(token)) {
        token = token[0];
    }
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, Secret, (err, decoded: any) => {
            if (err) {
                res.sendStatus(401);
            } else {
                req.payload = decoded;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}
