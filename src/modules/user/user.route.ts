import { Router, type NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { userController } from "./user.controller";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utility/catchAsync";
import { auth } from "../../middlewares/auth";



const router = Router();

router.post("/register", userController.createUser);
router.get("/me", auth(Role.ADMIN, Role.USER, Role.AUTHOR) ,userController.getProfile);


export const userRouter = router;