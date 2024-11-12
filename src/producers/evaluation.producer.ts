import logger from "../config/logger.config";
import evaluationQueue from "../queues/evaluation.queue";

export default async function evaluationProducer(payload: Record<string, unknown>) {
    await evaluationQueue.add("EvaluationJob", payload);
    logger.info(`New submission job added %o`, payload);
}
