import sampleQueue from "../queues/sample.queue";

export default async function sampleProducer(
    name: string,
    payload: Record<string, unknown>
) {
    await sampleQueue.add(name, payload);
    console.log("New job added", name, payload);
}
