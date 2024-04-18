import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";

import { generateRandomString } from "./utils";
import { getAllFiles } from "./file";


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

    

   
   
    res.json({id:id});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
