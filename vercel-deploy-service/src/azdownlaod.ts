import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey: string = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';

// Create a StorageSharedKeyCredential object with account name and account key
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a BlobServiceClient object using the StorageSharedKeyCredential
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);


async function downloadBlob(containerName: string, blobName: string): Promise<void> {
    console.log("Downloading Blobs....");
    
    // Get a container client from the BlobServiceClient
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // // List blobs in the container
    // let i = 0;
    const listBlobsResponse = containerClient.listBlobsFlat({prefix: `${blobName}/`}).byPage();
    const downloadPromises: Promise<void>[] = [];
    for await (const response of listBlobsResponse) {
        for (const blob of response.segment.blobItems) {
            console.log(blob.name);
            downloadPromises.push(downloadFile(blob.name, containerClient));
            // i++;

        }
    }
    // console.log(`Total files downloaded: ${i}`);
    await Promise.all(downloadPromises);
    console.log(`Total files downloaded: ${downloadPromises.length}`);
    
    // //works for a single file
    // // Get a blob client from the container client
    // const blobClient = containerClient.getBlobClient(blobName);

    // // Download the blob content to a local file
    // const downloadResponse = await blobClient.download();
    // await downloadResponse.readableStreamBody!.pipe(fs.createWriteStream(localFilePath));

    // console.log(`Blob downloaded to ${localFilePath}`);

}
async function downloadFile(blobName:string, containerClient: any){
    const localFilePath = path.join(__dirname, '/output');
    const fileNameWithPath = path.join(localFilePath, blobName);
    const blobClient = await containerClient.getBlobClient(blobName);
    ensureDirectoryExists(fileNameWithPath);
    const downloadResult = await blobClient.downloadToFile(fileNameWithPath);
    if (!downloadResult.errorCode) {
        console.log(`download ${blobName} successfully `);
    } else {
        console.error(`download ${blobName} failed `);
    }
}
function ensureDirectoryExists(filePath: string): void {
    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Created directories: ${directoryPath}`);
    } else {
        console.log(`Directories already exist: ${directoryPath}`);
    }
}


export function downloadBlobFun(blobName: string, containerName: string){
    console.log("prefix inside downloadBlobFun: ", blobName);
    downloadBlob(containerName, blobName)
        .then(() => console.log('File downloaded successfully'))
        .catch(error => console.error('Error downloading file(exp fun):', error));

}