import express from "express";
import bodyParser from "body-parser";
import serverConfig from "./config/server.config";
import apiRouter from "./routes";

import logger from "./config/logger.config";
import serverAdapter from "./config/bullboard.config";
import runPython from "./containers/runPythonDocker";
import runJava from "./containers/runJavaDocker";
import runCpp from "./containers/runCppContainer";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    logger.info(`server started on ${serverConfig.PORT}`);
    logger.info(
        `Bullboard dashboard running on http://localhost:${serverConfig.PORT}/admin/queues`
    );

    const code = `
        #include<iostream>
        using namespace std;

        int main(){
            int x;
            cin>>x;
            cout<<"value of x is: "<<x;
            for(int i=0; i<x; i++){
                cout<<i<<"\\\\n";
            }
            cout<<endl;
        }
    `;
    runCpp(code, "10");
    // runJava(code, "100");
    // runPython(code, "100\n200");
});
