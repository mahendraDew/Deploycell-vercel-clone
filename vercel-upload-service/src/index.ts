import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";

import { generateRandomString } from "./utils";
import { getAllFiles } from "./file";
import { uploadFiles } from "./azure";

import { createClient } from "redis";
const publisher = createClient();
publisher.connect();
const subscriber = createClient();
subscriber.connect();
// import { createContainerFun } from "./azure";

// uploadFiles("outputcontainer", "img/mountainnn.jpg", "/home/mahendra/Desktop/working dir/vercel-clone/dist/output/WoazH/src/assets/example.jpg");
// createContainerFun("output-container", "WoazH/img/mountainnn.jpg", "/home/mahendra/Desktop/working dir/vercel-clone/dist/output/WoazH/src/assets/example.jpg");
      
//                      output-indi-folder       file-name                   local-file-path

const app = express();
app.use(cors());
app.use(express.json());

// POSTMAN
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);

    const id = generateRandomString(); // asd12
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    console.log(files);

    files.forEach(file => {
        let blobName = file.split(`output/${id}/`)[1];
        // createContainerFun(id);
        // uploadFiles(id, blobName, file);
        blobName = path.join(id, blobName);
        uploadFiles("outputcontainer", blobName, file);
        // console.log(blobName);
    });

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
   
    res.json({id:id});
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
