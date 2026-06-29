import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const payload = req.body;
    const {userWithoutPassword : loginResult, accessToken, refreshToken} = await authService.loginUser(payload);

    res.cookie("accessToken", accessToken,{
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "User Logged In Successfully",
        data : {loginResult},
    });
});

export const authController = {
    loginUser,
}