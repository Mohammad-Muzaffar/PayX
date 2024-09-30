import { NextResponse } from "next/server"
import  PrismaClient  from "@repo/db/client";

const client = PrismaClient;

export const GET = async () => {
    await client.user.create({
        data: {
            email: "asd",
            name: "adsads",
            password: "asdssdfdf",
            number: "3234233432434"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}