"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBlobFun = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const utils_1 = require("./utils");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
// Create a StorageSharedKeyCredential object with account name and account key
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
// Create a BlobServiceClient object using the StorageSharedKeyCredential
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
function downloadBlob(containerName, blobName) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Downloading Blobs....");
        // Get a container client from the BlobServiceClient
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // // List blobs in the container
        // let i = 0;
        const listBlobsResponse = containerClient.listBlobsFlat({ prefix: `${blobName}/` }).byPage();
        const downloadPromises = [];
        try {
            for (var listBlobsResponse_1 = __asyncValues(listBlobsResponse), listBlobsResponse_1_1; listBlobsResponse_1_1 = yield listBlobsResponse_1.next(), !listBlobsResponse_1_1.done;) {
                const response = listBlobsResponse_1_1.value;
                for (const blob of response.segment.blobItems) {
                    console.log(blob.name);
                    downloadPromises.push(downloadFile(blob.name, containerClient));
                    // i++;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (listBlobsResponse_1_1 && !listBlobsResponse_1_1.done && (_a = listBlobsResponse_1.return)) yield _a.call(listBlobsResponse_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // console.log(`Total files downloaded: ${i}`);
        yield Promise.all(downloadPromises);
        console.log(`Total files downloaded: ${downloadPromises.length}`);
        yield (0, utils_1.buildProject)(blobName !== null && blobName !== void 0 ? blobName : '');
        yield copyFinalDist(blobName !== null && blobName !== void 0 ? blobName : '');
    });
}
function downloadFile(blobName, containerClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const localFilePath = path.join(__dirname, '/output');
        const fileNameWithPath = path.join(localFilePath, blobName);
        const blobClient = yield containerClient.getBlobClient(blobName);
        ensureDirectoryExists(fileNameWithPath);
        const downloadResult = yield blobClient.downloadToFile(fileNameWithPath);
        if (!downloadResult.errorCode) {
            console.log(`download ${blobName} successfully `);
        }
        else {
            console.error(`download ${blobName} failed `);
        }
    });
}
function ensureDirectoryExists(filePath) {
    const directoryPath = path.dirname(filePath);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Created directories: ${directoryPath}`);
    }
    else {
        console.log(`Directories already exist: ${directoryPath}`);
    }
}
function downloadBlobFun(blobName, containerName) {
    console.log("prefix inside downloadBlobFun: ", blobName);
    downloadBlob(containerName, blobName)
        .then(() => console.log('File downloaded successfully'))
        .catch(error => console.error('Error downloading file(exp fun):', error));
}
exports.downloadBlobFun = downloadBlobFun;
function copyFinalDist(id) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    console.log(allFiles);
    allFiles.forEach(file => {
        const fileName = path.join(id, file.split(`output/${id}/dist`)[1]);
        uploadFile("distcontainer", fileName, file);
        // console.log(file.split(`output/${id}/`)[1]);
    });
}
function getAllFiles(folderPath) {
    let response = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        }
        else {
            response.push(fullFilePath);
        }
    });
    return response;
}
function uploadFile(containerName, blobName, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Assests Uploading started...");
        // Create the container if it doesn't exist and if exist then put items in that same container
        // await createContainer(containerName);
        const containerClient = blobServiceClient.getContainerClient(containerName); //container name - individual output folders
        const blockBlobClient = containerClient.getBlockBlobClient(blobName); //file name
        // Upload the file
        yield blockBlobClient.uploadFile(localFilePath); // local file path
        console.log(`File "${blobName}" uploaded successfully.`);
    });
}
