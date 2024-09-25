import  PrismaClient  from '@repo/db/client';
import { NextResponse } from "next/server"

const client =  PrismaClient;

export const GET = async () => {
    await client.user.create({
        data: {
            email: "asd23@gmail.com",
            name: "adsads"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}