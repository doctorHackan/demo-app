import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {

    try{

        const user = await userService.registerUserToDB(req.body);
    
        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Registered Successfully",
            data: {
                user
            }
        });

    } catch(error){
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: (error as Error).message
        });
    }
};


export const userController = {
    createUser,
};