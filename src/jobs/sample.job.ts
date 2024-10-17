import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob {
    name: string;
    payload: Record<string, unknown>;

    constructor(payload: Record<string, unknown>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }
    handler = (job?: Job) => {
        console.log("Job handler");
        if (job) {
            console.log(job.name, job.id, job.data);
        }
    };

    failed = (job?: Job) => {
        console.log("Job Failed");
        if (job) {
            console.log(job.id);
        }
    };
}
