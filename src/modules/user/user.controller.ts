import httpStatus from "http-status";
import type { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";

const createUser = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const user = await userService.registerUserToDB(req.body);
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User Registered Successfully",
        data : { user },
    })
});

const getProfile = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

    if(typeof req.user === "undefined")
        throw new Error("no user in request");
   
    const { id, name, email, role } = req.user;

    console.log(id,name,email,role);
    const profile = await userService.getProfileFromDB(id);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Profile Retrieved Successfully",
        data : profile,
    });
});

const updateProfile = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedUser = await userService.updateProfileInDB(userId, payload);

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "User Updated Successfully",
        data : { updatedUser },
    })
});

export const userController = {
    createUser,
    getProfile,
    updateProfile
};