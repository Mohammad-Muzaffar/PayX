import { Request, Response} from 'express';
import db from "@repo/db/client";
import { Prisma } from '@prisma/client'

interface paymentInfo {
        token: string;
        userId: string;
        amount: string
}

export const hdfcWebhookController = async (req: Request, res: Response) => {
    const paymentInformation: paymentInfo = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }

    try {
        await db.$connect();
        // Starting a transaction:
        const transaction = await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success"
                }
            })
        ]);
        // Transaction end.

        res.status(200).json({
            message: "Captured the ammount!"
        })

    } catch(error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            res.status(411).json({
                error: error.message
            });
        } else {
            console.error(error);
            res.status(411).json({
                message: "Error while processing webhook"
            })
        }
    } finally {
        await db.$disconnect();
    }
}  