import express from "express";
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import AzureFunction from '@azure/functions';
import Context from '@azure/functions';
import { HttpRequest } from "@azure/functions";
import dotenv from 'dotenv';
import * as path from 'path';
import { fetchFileFromAzureBlobStorage } from "./azure";
dotenv.config();

const accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey: string = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';

// Create a StorageSharedKeyCredential object with account name and account key
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a BlobServiceClient object using the StorageSharedKeyCredential
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);


const app = express();

const containerName = "distcontainer";

app.get("/*", async (req, res) => {

    // Route with ID as query parameter
    // const id = req.params.id; // Access ID from URL path
    // res.send(`ID from URL path: ${id}`);


    const host = req.hostname;
    const id = host.split(".")[0];
    console.log("host:", host);
    console.log("id:", id);
    // const file = req.params.file;
    const filePath = req.path
    console.log(filePath); // we can use split to split the url and get the filepath
    // console.log(file);
    
    await fetchFileFromAzureBlobStorage(req, res, id, filePath);



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
});



app.listen(3001, () => {
    console.log("Server is running on port 3001..");
});