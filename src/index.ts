import express from "express";
import bodyParser from "body-parser";
import serverConfig from "./config/server.config";
import apiRouter from "./routes";

import logger from "./config/logger.config";
import serverAdapter from "./config/bullboard.config";

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    logger.info(`server started on ${serverConfig.PORT}`);
    logger.info(
        `Bullboard dashboard running on http://localhost:${serverConfig.PORT}/admin/queues`
    );
});
