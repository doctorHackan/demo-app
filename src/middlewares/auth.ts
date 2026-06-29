import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utility/catchAsync";
import config from "../config";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type { Role } from "../../generated/prisma/enums";


declare global {
    namespace Express {
        interface Request {
            user ? : {
                id : string;
                name : string;
                email : string;
                role : Role;
            }
        }
    }
}


export const auth = ( ...requiredRoles : Role[]) => {
    return catchAsync(async (req : Request, res : Response, next : NextFunction) => {
        const { accessToken } = req.cookies;

        if(!accessToken) 
            throw new Error("You are not logged in. Please log in to access the resources");

        console.log(accessToken);

        const tokenPayload = jwt.verify(accessToken, config.jwt_secret as string);

        if(typeof tokenPayload === "string")
        throw new Error("token Payload");

        const { name, email, id, role } = tokenPayload;

        if(!requiredRoles.includes(role)){
            throw new Error("You Do Not Have Access To This Resource");
        }

        const user = await prisma.user.findUniqueOrThrow({
            where : {
                id,
                name,
                role,
                email,
            }
        });

        if(user.activestatus == 'BLOCKED')
            throw new Error("Your Account Is Blocked");

        req.user = {
            name,
            id,
            role,
            email,
        }

        next();
    })
}
