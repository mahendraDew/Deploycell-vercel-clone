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

export function copyFinalDist(id: string){
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    console.log(allFiles);
    
    allFiles.forEach(file => {
        const fileName = path.join(id, file.split(`output/${id}/dist`)[1]);
        uploadFile("distcontainer", fileName, file);
        // console.log(file.split(`output/${id}/`)[1]);
    });
}

function getAllFiles(folderPath: string): string[]{
    let response: string[] = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if(fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else{
            response.push(fullFilePath);
        }
    });
    return response;
}

async function uploadFile(containerName: string, blobName: string, localFilePath: string): Promise<void> {

    console.log("Assests Uploading started...");
    // Create the container if it doesn't exist and if exist then put items in that same container
    // await createContainer(containerName);

    const containerClient = blobServiceClient.getContainerClient(containerName);  //container name - individual output folders
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); //file name
  
    // Upload the file
    await blockBlobClient.uploadFile(localFilePath);  // local file path
  
    console.log(`File "${blobName}" uploaded successfully.`);
}
