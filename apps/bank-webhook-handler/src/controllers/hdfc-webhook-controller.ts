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
        userId: req.body.userId,
        amount: req.body.ammount
    }
    const userId = parseInt(paymentInformation.userId);
    const ammount = parseInt(paymentInformation.amount);
    
    if (isNaN(userId) || isNaN(ammount)) {
        res.status(400).json({
            message: "Invalid userId or amount. They must be valid numbers."
        });
        return;
    }

    try {
        await db.$connect();
        // Starting a transaction:
        const transaction = await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: userId
                },
                data: {
                    amount: {
                        increment: ammount
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

    } catch(error: any) {
        if(error instanceof Prisma.PrismaClientKnownRequestError || Prisma.PrismaClientValidationError){
            res.status(411).json({
                error: error.message
            });
        } else {
            console.error(error);
            res.status(411).json({
                message: "Error while processing webhook",
                details: error
            })
        }
    } finally {
        await db.$disconnect();
    }
}  