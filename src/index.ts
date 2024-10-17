import express from "express";
import serverConfig from "./config/server.config";
import apiRouter from "./routes";
import sampleProducer from "./producers/sample.producer";
import sampleWorker from "./workers/sample.worker";

const app = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`server started on ${serverConfig.PORT}`);
    console.log("Hello");

    sampleWorker("SampleQueue");

    sampleProducer("SampleJob", {
        name: "Harshit",
        College: "Chandigarh University",
    });
});
