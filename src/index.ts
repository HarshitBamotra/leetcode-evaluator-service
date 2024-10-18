import express from "express";
import serverConfig from "./config/server.config";
import apiRouter from "./routes";
import sampleProducer from "./producers/sample.producer";
import sampleWorker from "./workers/sample.worker";
import logger from "./config/logger.config";

const app = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
    logger.info(`server started on ${serverConfig.PORT}`);

    sampleWorker("SampleQueue");

    sampleProducer(
        "SampleJob",
        {
            name: "Harshit",
            College: "Chandigarh University",
        },
        1
    );
});
