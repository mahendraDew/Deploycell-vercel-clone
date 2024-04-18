// filename : /output/asd12/src/App.jsx
// filepath: /home/mahendra/Desktop/working dir/vercel-clone/dist/output/0FxyO/src/App.jsx'

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';


import dotenv from 'dotenv';
dotenv.config();

const accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey: string = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';


// Create a new StorageSharedKeyCredential
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a new BlobServiceClient using the StorageSharedKeyCredential
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
    );


// Function to create a container - container here is actually the individual output folders ex: /output/asd12
async function createContainer(containerName: string, blobName: string, localFilePath: string): Promise<void> {
  console.log("Checking for container...")
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // Check if the container already exists
  const exists = await containerClient.exists();
  if (!exists) {
    // Create the container if it doesn't exist
    console.log("Creating container...")
    await containerClient.create();
    console.log(`Container "${containerName}" created successfully.`);
  } else {
    console.log(`Container "${containerName}" already exists.`);
  }

  uploadFile(containerName, blobName, localFilePath)
     .catch(err => console.error('Error uploading file:', err));
}
  
// Upload a file to Azure Blob Storage
async function uploadFile(containerName: string, blobName: string, localFilePath: string): Promise<void> {

    console.log("Upload started...");
    // Create the container if it doesn't exist and if exist then put items in that same container
    // await createContainer(containerName);

    const containerClient = blobServiceClient.getContainerClient(containerName);  //container name - individual output folders
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); //file name
  
    // Upload the file
    await blockBlobClient.uploadFile(localFilePath);  // local file path
  
    console.log(`File "${blobName}" uploaded successfully.`);
}



export const uploadFiles = (containerName: string, blobName: string, localFilePath: string) => {
  console.log("containerName: ", containerName);
  console.log("blobName: ", blobName);
  console.log("localFilePath: ", localFilePath);
  uploadFile(containerName, blobName, localFilePath)
     .catch(err => console.error('Error uploading file:', err));
}

// export const createContainerFun = (containerName: string, blobName: string, localFilePath: string) => {
//   console.log("containerName: ", containerName);
//   console.log("blobName: ", blobName);
//   console.log("localFilePath: ", localFilePath);
//   createContainer(containerName, blobName, localFilePath);
// }