import * as Joi from "joi";

export const signInRequest = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().required()
});

export interface ISignInRequest {
    email: string;
    password: string;
}
