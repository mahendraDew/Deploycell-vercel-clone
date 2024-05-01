import { createClient, commandOptions } from "redis";
import {  downloadBlobFun } from "./azdownlaod";
import { buildProject } from "./utils";
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    // const blobName= "p8Q0C";
    const containerName = "outputcontainer";
    while(1){
        const response = await subscriber.brPop(
            commandOptions({isolated: true}), 
            'build-queue',
            0
        );
        const id = response?.element;
        console.log(id);

        
        await downloadBlobFun(id ?? '', containerName);
        // await buildProject(id ?? '');
        // await copyFinalDist(id ?? '');

        if(id != undefined){
            publisher.hSet("status", id, "deployed");
        }
    }
        // await downloadAzureFiles("p8Q0C");

}

main();