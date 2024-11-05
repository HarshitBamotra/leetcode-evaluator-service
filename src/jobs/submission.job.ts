import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import logger from "../config/logger.config";
import { SubmissionPayload } from "../types/submissionPayload";
import runCpp from "../containers/runCppContainer";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handler = async (job?: Job) => {
        if (job) {
            const key = Object.keys(this.payload)[0];
            if(this.payload[key].language === "CPP"){
                const response = await runCpp(this.payload[key].code, this.payload[key].inputCase);
                console.log("Evaluated response is: ", response);
            }
            if(this.payload[key].language === "Java"){

            }
        }
    };

    failed = (job?: Job) => {
        logger.info("Job Failed");
        if (job) {
            logger.info(`Job Id: ${job.id}`);
        }
    };
}
