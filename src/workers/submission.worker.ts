import { Job, Worker } from "bullmq";
import SubmissionJob from "../jobs/submission.job";
import redisConnection from "../config/redis.config";

export default function submissionWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            if (job.name === "SubmissionJob") {
                const submissionjob = new SubmissionJob(job.data);

                submissionjob.handler(job);
                return true;
            }
        },
        { connection: redisConnection }
    );
}
