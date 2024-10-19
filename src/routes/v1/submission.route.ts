import express from "express";
import { pingCheck } from "../../controllers/ping.controller";
import { addSubmission } from "../../controllers/submission.controller";
import { validateCreateSubmissionDto } from "../../validators/create-submission.validator";
import { createSubmissionZodSchema } from "../../dtos/create-submission.dto";

const submissionRouter = express.Router();

submissionRouter.get("/ping", pingCheck);

submissionRouter.post(
    "/",
    validateCreateSubmissionDto(createSubmissionZodSchema),
    addSubmission
);

export default submissionRouter;
