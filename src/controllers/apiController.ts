import { Router } from "express";
import { authMidlleware } from "../middlewares/auth";
import {
    signInRequest,
    ISignInRequest,
    RequestWithPayload
} from "../models/model";
import * as Joi from "joi";
import * as jwt from "jsonwebtoken";
import { Users, Secret, Secret2 } from "../configs/appConfig";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

export function apiController(router: Router) {
    const generatedKeys = {} as any;

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
    router.post("/generate-key-pair", authMidlleware, function(
        req: RequestWithPayload,
        res
    ) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
                cipher: "aes-256-cbc",
                passphrase: Secret2
            }
        });
        generatedKeys[req.payload!.email] = publicKey;
        res.json({ privKey: privateKey, pubKey: publicKey });
    });
    router.post("/encrypt", authMidlleware, async function(
        req: RequestWithPayload,
        res
    ) {
        if (generatedKeys[req.payload!.email]) {
            const filePath = path.resolve(process.cwd(), `data`, `sample.pdf`);
            const readFilePromisified = promisify(fs.readFile);
            const fileContent = await readFilePromisified(filePath);
            res.send({
                fileContent: fileContent.toString("base64"),
                publicKey: generatedKeys[req.payload!.email]
            });
        } else {
            res.sendStatus(400);
        }
    });
    return router;
}
