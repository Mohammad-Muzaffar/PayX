"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export const createOnRampTransaction = async (provider: string, ammount: number) => {
    const session = await getServerSession(authOptions);
    if(!session?.user || !session.user.id){
        return {
            message: "Unauthorized!"
        }
    }

    const token = (Math.random() * 1000).toString();
    const transaction = await prisma.$transaction([
        prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing",
                startTime: new Date(),
                token: token,
                userId: Number(session?.user?.id),
                amount: ammount * 100
            }
        })
    ]);
    return {
        message: "Done!"
    }
}