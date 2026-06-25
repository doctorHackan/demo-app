import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const PORT = config.port;

const main = async ()=>{
    try{

        await prisma.$connect();
        console.log("Connected to DB");

        app.listen(PORT, ()=>{
            console.log(`Listening at port ${PORT}`);
        })

    } catch(error){
        console.error("Error Occurred :",error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();