import { Job, Worker } from "bullmq";
import SampleJob from "../jobs/sample.job";
import redisConnection from "../config/redis.config";

export default function sampleWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            if (job.name === "SampleJob") {
                const samplejob = new SampleJob(job.data);

                samplejob.handler(job);
                return true;
            }
        },
        { connection: redisConnection }
    );
}
