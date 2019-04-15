import { appLogic } from "./appLogic";
import { AddressInfo } from "net";

const server = appLogic();
console.log(`App listening on port ${
    (server.address() as AddressInfo).port}!`)
