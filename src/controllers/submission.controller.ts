import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/create-submission.dto";

export function addSubmission(req: Request, res: Response) {
    const submissionDto = req.body as CreateSubmissionDto;

    // TODO: Add validation
    console.log(submissionDto);
    return res.status(201).json({
        success: true,
        error: {},
        message: "Sucessfully added submission",
        data: submissionDto,
    });
}
