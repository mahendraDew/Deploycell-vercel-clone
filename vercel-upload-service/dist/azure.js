"use strict";
// filename : /output/asd12/src/App.jsx
// filepath: /home/mahendra/Desktop/working dir/vercel-clone/dist/output/0FxyO/src/App.jsx'
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
exports.uploadFiles = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
// Create a new StorageSharedKeyCredential
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
// Create a new BlobServiceClient using the StorageSharedKeyCredential
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
// Function to create a container - container here is actually the individual output folders ex: /output/asd12
function createContainer(containerName, blobName, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Checking for container...");
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Check if the container already exists
        const exists = yield containerClient.exists();
        if (!exists) {
            // Create the container if it doesn't exist
            console.log("Creating container...");
            yield containerClient.create();
            console.log(`Container "${containerName}" created successfully.`);
        }
        else {
            console.log(`Container "${containerName}" already exists.`);
        }
        uploadFile(containerName, blobName, localFilePath)
            .catch(err => console.error('Error uploading file:', err));
    });
}
// Upload a file to Azure Blob Storage
function uploadFile(containerName, blobName, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Upload started...");
        // Create the container if it doesn't exist and if exist then put items in that same container
        // await createContainer(containerName);
        const containerClient = blobServiceClient.getContainerClient(containerName); //container name - individual output folders
        const blockBlobClient = containerClient.getBlockBlobClient(blobName); //file name
        // Upload the file
        yield blockBlobClient.uploadFile(localFilePath); // local file path
        console.log(`File "${blobName}" uploaded successfully.`);
    });
}
const uploadFiles = (containerName, blobName, localFilePath) => {
    console.log("containerName: ", containerName);
    console.log("blobName: ", blobName);
    console.log("localFilePath: ", localFilePath);
    uploadFile(containerName, blobName, localFilePath)
        .catch(err => console.error('Error uploading file:', err));
};
exports.uploadFiles = uploadFiles;
// export const createContainerFun = (containerName: string, blobName: string, localFilePath: string) => {
//   console.log("containerName: ", containerName);
//   console.log("blobName: ", blobName);
//   console.log("localFilePath: ", localFilePath);
//   createContainer(containerName, blobName, localFilePath);
// }
