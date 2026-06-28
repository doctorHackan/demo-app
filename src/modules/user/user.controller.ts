import httpStatus from "http-status";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response, next : NextFunction) => {
    const user = await userService.registerUserToDB(req.body);
    sendResponse(res, {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User Registered Successfully",
        data : { user },
    })
});


export const userController = {
    createUser,
};