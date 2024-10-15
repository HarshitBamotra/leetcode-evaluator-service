import { Request, Response } from "express";

export const pingCheck = (req: Request, res: Response) => {
    return res.status(200).json({
        msg: "ping controller is up",
    });
};
