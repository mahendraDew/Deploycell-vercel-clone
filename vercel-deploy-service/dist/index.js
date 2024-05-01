"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const azdownlaod_1 = require("./azdownlaod");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // const blobName= "p8Q0C";
        const containerName = "outputcontainer";
        while (1) {
            const response = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            const id = response === null || response === void 0 ? void 0 : response.element;
            console.log(id);
            yield (0, azdownlaod_1.downloadBlobFun)(id !== null && id !== void 0 ? id : '', containerName);
            // await buildProject(id ?? '');
            // await copyFinalDist(id ?? '');
            if (id != undefined) {
                publisher.hSet("status", id, "deployed");
            }
        }
        // await downloadAzureFiles("p8Q0C");
    });
}
main();
