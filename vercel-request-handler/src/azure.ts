import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import AzureFunction from '@azure/functions';
import Context from '@azure/functions';
import { HttpRequest } from "@azure/functions";
import dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();


const accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey: string = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';

// Create a StorageSharedKeyCredential object with account name and account key
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a BlobServiceClient object using the StorageSharedKeyCredential
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

const containerName = "distcontainer";
const containerClient = blobServiceClient.getContainerClient(containerName);



export async function fetchFileFromAzureBlobStorage(req: any, res: any, id: string, filePath: string): Promise<void> {
    console.log("inside fetchfile from az...")
    try {
        console.log("inside try.....")
        
        const host = req.headers.host || "";
       

        // Fetch file contents from Azure Blob Storage
        let fileContents: Buffer | undefined;
        const blobName = `${id}${filePath}`;
        console.log("blobName:", blobName);
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadResponse = await blobClient.download();
        if(downloadResponse.readableStreamBody != undefined){
            fileContents = await streamToBuffer(downloadResponse.readableStreamBody);
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
    } catch (error) {
        res.writeHead(500, {
            "Content-Type": "text/plain"
        });
        res.end(`Errorrrrr: ${error}`);
    }
}

function getContentType(filePath: string): string {
    if (filePath.endsWith(".html")) {
        return "text/html";
    } else if (filePath.endsWith(".css")) {
        return "text/css";
    } else if (filePath.endsWith(".js")) {
        return "application/javascript";
    } else {
        return "application/octet-stream";
    }
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
        stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}

async function fetchAssociatedFiles(id: string): Promise<Buffer> {
    // Fetch associated files from Azure Blob Storage
    const htmlBlobName = `${id}/index.html`;
    const htmlBlobClient = containerClient.getBlobClient(htmlBlobName);
    const htmlDownloadResponse = await htmlBlobClient.download();
    let htmlFileContents;
    if(htmlDownloadResponse.readableStreamBody != undefined){
        htmlFileContents = await streamToBuffer(htmlDownloadResponse.readableStreamBody);
    }
    // Fetch other associated files (like CSS, JavaScript, images) 
    // and concatenate their contents
    // Adjust this part according to your project structure
    // For example, you might have a CSS file named style.css in the same directory
    const cssBlobName = `${id}/assets/index-DiwrgTda.css`;
    const cssBlobClient = containerClient.getBlobClient(cssBlobName);
    const cssDownloadResponse = await cssBlobClient.download();
    let cssFileContents;
    if(cssDownloadResponse.readableStreamBody != undefined){
        cssFileContents = await streamToBuffer(cssDownloadResponse.readableStreamBody);
    }

    // Fetch JavaScript file
    const jsBlobName = `${id}/assets/index-DvB2n8ga.js`;
    const jsBlobClient = containerClient.getBlobClient(jsBlobName);
    const jsDownloadResponse = await jsBlobClient.download();
    let jsFileContents;
    if(jsDownloadResponse.readableStreamBody != undefined){
        jsFileContents = await streamToBuffer(jsDownloadResponse.readableStreamBody);
    }
    // Concatenate HTML file contents and associated files
    if(htmlFileContents != undefined && cssFileContents != undefined && jsFileContents != undefined){
        return Buffer.concat([htmlFileContents, cssFileContents, jsFileContents]);
    }
    return Buffer.from("");
}