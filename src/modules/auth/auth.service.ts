import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import type { IAuthUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload : IAuthUser) => {
    const { email, password } = payload;
    
    const user = await prisma.user.findUniqueOrThrow({
        where : {email},
        include: {
            profileId: true,
        }
    });

    const passwordMatched = await bcrypt.compare(password, user.password);
    if(!passwordMatched) 
        throw new Error("Invalid Credentials");

    const jwtPayload = {
        id : user.id,
        name : user.name,
        email : user.email,
        role : user.role,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
        expiresIn : "1d",
    });

    const refreshToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
        expiresIn : "7d",
    });

    const { password : userPassword, ...userWithoutPassword } = user;

    return {
        userWithoutPassword,
        accessToken,
        refreshToken,
    };
}

export const authService = {
    loginUser,
}