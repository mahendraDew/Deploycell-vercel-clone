import { createClient, commandOptions } from "redis";
import { downloadAzureFiles } from "./azure";
import { downloadBlobFun } from "./azdownlaod";
const subscriber = createClient();
subscriber.connect();

async function main() {
    const blobName= "p8Q0C";
    const containerName = "outputcontainer";
    while(1){
        const response = await subscriber.brPop(
            commandOptions({isolated: true}), 
            'build-queue',
            0
        );
        const id = response?.element;
        console.log(id);

        // await downloadAzureFiles(`output/${id}`)
        await downloadBlobFun(id ?? '', containerName);
    }
        // await downloadAzureFiles("p8Q0C");

}

main();