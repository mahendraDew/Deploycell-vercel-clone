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
const storage_blob_1 = require("@azure/storage-blob");
const dotenv_1 = __importDefault(require("dotenv"));
const azure_1 = require("./azure");
dotenv_1.default.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
// Create a StorageSharedKeyCredential object with account name and account key
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
// Create a BlobServiceClient object using the StorageSharedKeyCredential
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
const app = (0, express_1.default)();
const containerName = "distcontainer";
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Route with ID as query parameter
    // const id = req.params.id; // Access ID from URL path
    // res.send(`ID from URL path: ${id}`);
    const host = req.hostname;
    const id = host.split(".")[0];
    console.log("host:", host);
    console.log("id:", id);
    // const file = req.params.file;
    const filePath = req.path;
    console.log(filePath); // we can use split to split the url and get the filepath
    // console.log(file);
    yield (0, azure_1.fetchFileFromAzureBlobStorage)(req, res, id, filePath);
    // const httpTrigger = async function foo(context: Context, req: HttpRequest): Promise<void> {
    //     const containerName = "distcontainer"; // Replace with your container name
    //     try {
    //         // Initialize Azure Blob Service Client
    //         const containerClient = blobServiceClient.getContainerClient(containerName);
    //         // // Extracting ID and file path from request
    //         // const host = req.headers.host || "";
    //         // const id = host.split(".")[0];
    //         // const filePath = req.url || "";
    //         // Fetch file from Azure Blob Storage
    //         const blobClient = containerClient.getBlobClient(`dist/${id}${filePath}`);
    //         const downloadResponse = await blobClient.download();
    //         const fileContents = await streamToBuffer(downloadResponse.readableStreamBody!);
    //         // Determine content type based on file extension
    //         const contentType = getContentType(filePath);
    //         // Set response headers
    //         context.res = {
    //             status: 200,
    //             headers: {
    //                 "Content-Type": contentType
    //             },
    //             body: fileContents.toString()
    //         };
    //     } catch (error) {
    //         context.res = {
    //             status: 500,
    //             body: `Error: ${error}`
    //         };
    //     }
    // };
}));
app.listen(3001, () => {
    console.log("Server is running on port 3001..");
});
