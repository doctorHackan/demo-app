import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { registerUser } from "./user.interface";


const registerUserToDB = async (payload : registerUser) => {

    const { email, name, password } = payload;

    const doesUserExist = await prisma.user.findUnique({
        where: { email }
    });

    if (doesUserExist){
        throw new Error("User already exists with this email");
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    await prisma.profile.create({
        data: {
            userId: createdUser.id
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            email: createdUser.email || email,
            id: createdUser.id
        },
        omit: {
            password: true
        },
        include: {
            profileId: true,
        }
    });

    return user;
}


export const userService = {
    registerUserToDB,
}