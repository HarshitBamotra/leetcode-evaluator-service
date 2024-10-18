import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import logger from "../config/logger.config";

export default class SampleJob implements IJob {
    name: string;
    payload: Record<string, unknown>;

    constructor(payload: Record<string, unknown>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handler = (job?: Job) => {
        if (job) {
            console.log(job.name, job.id, job.data);
        }
    };

    failed = (job?: Job) => {
        logger.info("Job Failed");
        if (job) {
            logger.info(`Job Id: ${job.id}`);
        }
    };
}
