import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler = (requestHandler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Promise.resolve(requestHandler(req, res, next));
        } catch (err) {
            next(err);
        }
    };
};

export { asyncHandler };
