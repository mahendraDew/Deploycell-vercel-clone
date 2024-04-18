
import dotenv from 'dotenv';
dotenv.config();

const accountName: string = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey: string = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';


// import { BlobServiceClient } from '@azure/storage-blob';

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
// Create a new StorageSharedKeyCredential
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Create a new BlobServiceClient using the StorageSharedKeyCredential
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
    );


async function downloadFile(containerName: string, blobName: string): Promise<void> {
  console.log("inside download file....")
  console.log("containerName: ", containerName);
  console.log("blobName: ", blobName);
  // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};`;
  // const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};`;


  // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  // Get blob content as a buffer
  const response = await blobClient.download();
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
}


export function downloadAzureFiles(prefix: string){
  console.log("prefix: ", prefix);
  console.log("inside azure....")
  const containerName = 'outputcontainer';
  const blobName = 'p8Q0C';
  downloadFile(containerName, blobName);
}