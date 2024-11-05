import logger from "../config/logger.config";
import submissionQueue from "../queues/submission.queue";

export default async function submissionProducer(payload: Record<string, unknown>) {
    await submissionQueue.add("SubmissionJob", payload);
    logger.info(`New submission job added %o`, payload);
}
