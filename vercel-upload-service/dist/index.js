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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const file_1 = require("./file");
const azure_1 = require("./azure");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
publisher.connect();
// import { createContainerFun } from "./azure";
// uploadFiles("outputcontainer", "img/mountainnn.jpg", "/home/mahendra/Desktop/working dir/vercel-clone/dist/output/WoazH/src/assets/example.jpg");
// createContainerFun("output-container", "WoazH/img/mountainnn.jpg", "/home/mahendra/Desktop/working dir/vercel-clone/dist/output/WoazH/src/assets/example.jpg");
//                      output-indi-folder       file-name                   local-file-path
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// POSTMAN
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = (0, utils_1.generateRandomString)(); // asd12
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    const files = (0, file_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
    console.log(files);
    files.forEach(file => {
        let blobName = file.split(`output/${id}/`)[1];
        // createContainerFun(id);
        // uploadFiles(id, blobName, file);
        blobName = path_1.default.join(id, blobName);
        (0, azure_1.uploadFiles)("outputcontainer", blobName, file);
        // console.log(blobName);
    });
    publisher.lPush("build-queue", id);
    res.json({ id: id });
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
