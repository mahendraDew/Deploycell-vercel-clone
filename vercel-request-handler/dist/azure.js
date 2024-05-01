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
exports.fetchFileFromAzureBlobStorage = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
// Create a StorageSharedKeyCredential object with account name and account key
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
// Create a BlobServiceClient object using the StorageSharedKeyCredential
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
const containerName = "distcontainer";
const containerClient = blobServiceClient.getContainerClient(containerName);
function fetchFileFromAzureBlobStorage(req, res, id, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inside fetchfile from az...");
        try {
            console.log("inside try.....");
            const host = req.headers.host || "";
            // Fetch file contents from Azure Blob Storage
            let fileContents;
            const blobName = `${id}${filePath}`;
            console.log("blobName:", blobName);
            const blobClient = containerClient.getBlobClient(blobName);
            const downloadResponse = yield blobClient.download();
            if (downloadResponse.readableStreamBody != undefined) {
                fileContents = yield streamToBuffer(downloadResponse.readableStreamBody);
            }
            // Determine content type based on file extension
            // const contentType = getContentType(filePath);
            const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript";
            console.log("contentType:", type);
            // Set the Content-Type header
            res.set("Content-Type", type);
            // Send the file contents as the response
            res.send(fileContents);
            // Set response headers
            // res.writeHead(200, {
            //     "Content-Type": contentType
            // });
            // res.end(fileContents);
            // if (filePath.endsWith(".html")) {
            //     // Fetch associated files (like CSS, JavaScript, images) 
            //     // and send them as well
            //     const associatedFiles = await fetchAssociatedFiles(id);
            //     let combinedContents;
            //     if(fileContents != undefined && associatedFiles != undefined){
            //         combinedContents = Buffer.concat([fileContents, associatedFiles]);
            //     }
            //     // Send the combined contents as the response
            //     res.send(combinedContents);
            // }
        }
        catch (error) {
            res.writeHead(500, {
                "Content-Type": "text/plain"
            });
            res.end(`Errorrrrr: ${error}`);
        }
    });
}
exports.fetchFileFromAzureBlobStorage = fetchFileFromAzureBlobStorage;
function getContentType(filePath) {
    if (filePath.endsWith(".html")) {
        return "text/html";
    }
    else if (filePath.endsWith(".css")) {
        return "text/css";
    }
    else if (filePath.endsWith(".js")) {
        return "application/javascript";
    }
    else {
        return "application/octet-stream";
    }
}
function streamToBuffer(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("end", () => resolve(Buffer.concat(chunks)));
            stream.on("error", reject);
        });
    });
}
function fetchAssociatedFiles(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch associated files from Azure Blob Storage
        const htmlBlobName = `${id}/index.html`;
        const htmlBlobClient = containerClient.getBlobClient(htmlBlobName);
        const htmlDownloadResponse = yield htmlBlobClient.download();
        let htmlFileContents;
        if (htmlDownloadResponse.readableStreamBody != undefined) {
            htmlFileContents = yield streamToBuffer(htmlDownloadResponse.readableStreamBody);
        }
        // Fetch other associated files (like CSS, JavaScript, images) 
        // and concatenate their contents
        // Adjust this part according to your project structure
        // For example, you might have a CSS file named style.css in the same directory
        const cssBlobName = `${id}/assets/index-DiwrgTda.css`;
        const cssBlobClient = containerClient.getBlobClient(cssBlobName);
        const cssDownloadResponse = yield cssBlobClient.download();
        let cssFileContents;
        if (cssDownloadResponse.readableStreamBody != undefined) {
            cssFileContents = yield streamToBuffer(cssDownloadResponse.readableStreamBody);
        }
        // Fetch JavaScript file
        const jsBlobName = `${id}/assets/index-DvB2n8ga.js`;
        const jsBlobClient = containerClient.getBlobClient(jsBlobName);
        const jsDownloadResponse = yield jsBlobClient.download();
        let jsFileContents;
        if (jsDownloadResponse.readableStreamBody != undefined) {
            jsFileContents = yield streamToBuffer(jsDownloadResponse.readableStreamBody);
        }
        // Concatenate HTML file contents and associated files
        if (htmlFileContents != undefined && cssFileContents != undefined && jsFileContents != undefined) {
            return Buffer.concat([htmlFileContents, cssFileContents, jsFileContents]);
        }
        return Buffer.from("");
    });
}
