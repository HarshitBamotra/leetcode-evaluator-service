import logger from "../config/logger.config";
import sampleQueue from "../queues/sample.queue";

export default async function sampleProducer(
    name: string,
    payload: Record<string, unknown>,
    priority: number
) {
    await sampleQueue.add(name, payload, { priority });
    logger.info(`New job added %o %o`, name, payload);
}
