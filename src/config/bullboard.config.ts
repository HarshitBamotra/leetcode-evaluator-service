import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import sampleQueue from "../queues/sample.queue";
import submissionQueue from "../queues/submission.queue";
import evaluationQueue from "../queues/evaluation.queue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(sampleQueue), new BullMQAdapter(submissionQueue), new BullMQAdapter(evaluationQueue)],
    serverAdapter: serverAdapter,
});

export default serverAdapter;
