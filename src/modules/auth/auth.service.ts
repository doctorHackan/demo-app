import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import type { IAuthUser } from "./auth.interface"

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

    const { password : userPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
}


export const authService = {
    loginUser,
}