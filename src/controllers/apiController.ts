import { Router } from "express";
import { authMidlleware } from "../middlewares/auth";
import { signInRequest, ISignInRequest } from "../models/model";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";
import { Users, Secret } from "../configs/appConfig";

export function apiController(router: Router) {
    router.post("/sign-in", function(req, res) {
        const validationResult = Joi.validate(req.body, signInRequest);
        if (validationResult.error) {
            res.status(400).send(validationResult.error.message);
        } else {
            const body = req.body as ISignInRequest;
            if (
                Users.some(
                    v => v.email === body.email && v.password === body.password
                )
            ) {
                const token = jwt.sign({ email: body.email }, Secret, {
                    expiresIn: "5m"
                });
                res.json({
                    authToken: token
                });
            } else {
                res.sendStatus(401);
            }
        }
    });
    router.post("/generate-key-pair", authMidlleware, function(req, res) {
        res.json({ data: "generate-key-pair" });
    });
    router.post("/encrypt", authMidlleware, function(req, res) {
        res.json({ data: "encrypt" });
    });
    return router;
}
