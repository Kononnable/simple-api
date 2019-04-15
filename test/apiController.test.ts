import { expect } from "chai";
import axios from "axios";
import { ISignInRequest } from "./../src/models/SignInRequest";
import { Users } from "../src/configs/appConfig";
import { appLogic } from "../src/appLogic";
import { Server } from "http";

const port = process.env.PORT || 3000;

describe("sign-in", function() {
    let server: Server;
    beforeEach(() => {
        server = appLogic();
    });
    afterEach(done => {
        server.close(done);
    });
    it("should sign in with correct credentials", async function() {
        const loginCredentials: ISignInRequest = Users[0];
        const response = await axios.post(
            `http://127.0.0.1:${port}/api/sign-in`,
            loginCredentials
        );
        expect(response.status).to.be.eq(200);
    });
    it("should not sign in with incorrect credentials", async function() {
        const loginCredentials: ISignInRequest = {
            email: "a@ss.ss",
            password: "b"
        };
        try {
            await axios.post(
                `http://127.0.0.1:${port}/api/sign-in`,
                loginCredentials
            );
        } catch (error) {
            expect(error.response.status).to.be.eq(401);
        }
    });
});
describe("generate-key-pair", function() {
    let server: Server;
    beforeEach(() => {
        server = appLogic();
    });
    afterEach(done => {
        server.close(done);
    });
    it("should sign in with correct credentials", async function() {
        const loginCredentials: ISignInRequest = Users[0];
        const loginResponse = await axios.post(
            `http://127.0.0.1:${port}/api/sign-in`,
            loginCredentials
        );
        const response = await axios.post(
            `http://127.0.0.1:${port}/api/generate-key-pair`,
            undefined,
            { headers: { Authorization: loginResponse.data.authToken } }
        );

        expect(response.data).to.have.property("privKey");
        expect(response.data).to.have.property("pubKey");
    });
    it("should not sign in with incorrect credentials", async function() {
        try {
            await axios.post(`http://127.0.0.1:${port}/api/generate-key-pair`);
        } catch (error) {
            expect(error.response.status).to.be.eq(401);
        }
    });
});

describe("/api/encrypt", function() {
    let server: Server;
    beforeEach(() => {
        server = appLogic();
    });
    afterEach(done => {
        server.close(done);
    });
    it("should return file data", async function() {
        const loginCredentials: ISignInRequest = Users[0];
        const loginResponse = await axios.post(
            `http://127.0.0.1:${port}/api/sign-in`,
            loginCredentials
        );
        const opts = {
            headers: { Authorization: loginResponse.data.authToken }
        };
        const generateKeyResponse = await axios.post(
            `http://127.0.0.1:${port}/api/generate-key-pair`,
            undefined,
            opts
        );
        const encryptResponse = await axios.post(
            `http://127.0.0.1:${port}/api/encrypt`,
            undefined,
            opts
        );

        expect(encryptResponse.data.publicKey).to.be.eq(
            generateKeyResponse.data.pubKey
        );
        expect(encryptResponse.data).to.have.property("fileContent");
    });
});
