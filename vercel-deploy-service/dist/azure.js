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
exports.downloadAzureFiles = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
// import { BlobServiceClient } from '@azure/storage-blob';
const storage_blob_1 = require("@azure/storage-blob");
// Create a new StorageSharedKeyCredential
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
// Create a new BlobServiceClient using the StorageSharedKeyCredential
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
function downloadFile(containerName, blobName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inside download file....");
        console.log("containerName: ", containerName);
        console.log("blobName: ", blobName);
        // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};`;
        // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};`;
        // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);
        // Get blob content as a buffer
        const response = yield blobClient.download();
        const blobBody = response.blobBody;
        console.log("blobBody: ", blobBody);
        // if (!blobBody) {
        //   throw new Error('Err Blob body is undefined!');
        // }
        // const buffer = await blobBody;
        // // Convert buffer to Blob URL and create a link for download
        // const blob = new Blob([buffer], { type: response.contentType });
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = blobName; // Specify the file name for download
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
    });
}
function downloadAzureFiles(prefix) {
    console.log("prefix: ", prefix);
    console.log("inside azure....");
    const containerName = 'outputcontainer';
    const blobName = 'p8Q0C';
    downloadFile(containerName, blobName);
}
exports.downloadAzureFiles = downloadAzureFiles;
