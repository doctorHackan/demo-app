import cookieParser from "cookie-parser";
import  express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const app : Application = express();


app.use(cors({
    origin : config.app_url,
    credentials : true,
}));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/",(req : Request,res : Response)=>{
    res.send("Hello World");
})

app.post("/api/user/register", async (req : Request, res : Response)=>{
    const { name, email, password } = req.body;

    const doesUserExist = await prisma.user.findUnique({
        where: {email}
    });

    if(doesUserExist)
        throw new Error("User already exists with this email");


    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
        data : {
            name,
            email,
            password : hashedPassword,
        }
    });

    await prisma.profile.create({
        data : {
            userId : createdUser.id
        }
    });

    const user = await prisma.user.findUnique({
        where : {
            email : createdUser.email || email,
            id : createdUser.id
        },
        omit:{
            password : true
        },
        include : {
            profileId : true,
        }
    });

    res.status(httpStatus.CREATED).json({
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User Registered Successfully",
        data : {
            user
        }
    });
})


export default app;