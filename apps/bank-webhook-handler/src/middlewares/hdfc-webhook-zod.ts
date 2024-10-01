import { Request, Response, NextFunction } from 'express';
import zod from 'zod';

const hdfcWebhookSchema = zod.object({
    token: zod.string(),
    userId: zod.string(),
    ammount: zod.string()
}); 

export const hdfcWebhookValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result =  hdfcWebhookSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({
            error: "Invalid argument (invalid request payload)",
            details: result.error.errors
        })
        return;
    }
    
    next();
}