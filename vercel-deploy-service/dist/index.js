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
const utils_1 = require("./utils");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const blobName = "p8Q0C";
        const containerName = "outputcontainer";
        while (1) {
            const response = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            const id = response === null || response === void 0 ? void 0 : response.element;
            console.log(id);
            // await downloadAzureFiles(`output/${id}`)
            yield (0, azdownlaod_1.downloadBlobFun)(id !== null && id !== void 0 ? id : '', containerName);
            yield (0, utils_1.buildProject)(id !== null && id !== void 0 ? id : '');
            yield (0, azdownlaod_1.copyFinalDist)(id !== null && id !== void 0 ? id : '');
        }
        // await downloadAzureFiles("p8Q0C");
    });
}
main();
