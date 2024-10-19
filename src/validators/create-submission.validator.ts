/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from "zod";
import { CreateSubmissionDto } from "../dtos/create-submission.dto";
import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.config";

export const validateCreateSubmissionDto =
    (schema: ZodSchema<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                ...req.body,
            });

            next();
        } catch (error) {
            logger.error(`Bad Request %o`, error);
            return res.status(400).json({
                success: false,
                message: "Invalid Request Params Received",
                data: {},
                error: error,
            });
        }
    };
