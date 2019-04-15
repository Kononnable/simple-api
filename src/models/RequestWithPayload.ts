import { Request } from "express";

export interface RequestWithPayload extends Request {
    payload?: { email: string };
}
