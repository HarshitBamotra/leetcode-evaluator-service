import express from "express";
import serverConfig from "./config/server.config";
import apiRouter from "./routes";

const app = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`server started on ${serverConfig.PORT}`);
    console.log("Hello");
});
