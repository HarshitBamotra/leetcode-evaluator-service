import { Job } from "bullmq";
import { IJob } from "../types/bullMqJobDefinition";
import logger from "../config/logger.config";
import { SubmissionPayload } from "../types/submissionPayload";
import runCpp from "../containers/cppExecutor";
import createExecutor from "../utils/ExecutorFactory";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handler = async (job?: Job) => {
        console.log("JOB HANDLER CALLED");
        // console.log(job);
        if (job) {
            const key = Object.keys(this.payload)[0];
            const codeLanguage = this.payload[key].language;
            const code = this.payload[key].code;
            const input = this.payload[key].inputCase;
            const output = this.payload[key].outputCase;
            // if(codeLanguage === "C_CPP"){
            //     const response = await runCpp(this.payload[key].code, this.payload[key].inputCase);
            //     console.log("Evaluated response is: ", response);
            // }
            // if(this.payload[key].language === "Java"){

            // }

            const strategy = createExecutor(codeLanguage);
            if(strategy !== null){
                const response : ExecutionResponse = await strategy.execute(code, input, output);
                if(response.status.toLowerCase() === "completed"){
                    console.log("code executed successfully");
                    console.log(response);
                }
                else{
                    console.log("something went wrong");
                    console.log(response);
                }
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
