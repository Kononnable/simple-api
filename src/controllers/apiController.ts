import { Router } from "express";
import { authMidlleware } from "../middlewares/auth";
import { signInRequest } from "../models/model";
import * as Joi from "joi";

export function apiController(router: Router) {
    router.post("/sign-in", function(req, res) {
        const validationResult = Joi.validate(req.body, signInRequest);
        if (validationResult.error) {
            res.status(400).send(validationResult.error.message);
        } else {
            res.json({ data: "/sign-in" });
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
