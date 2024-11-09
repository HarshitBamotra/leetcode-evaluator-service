import express from "express";
import bodyParser from "body-parser";
import serverConfig from "./config/server.config";
import apiRouter from "./routes";

import logger from "./config/logger.config";
import serverAdapter from "./config/bullboard.config";
import runPython from "./containers/pythonExecutor";
import runJava from "./containers/JavaExecutor";
import runCpp from "./containers/cppExecutor";
import submissionWorker from "./workers/submission.worker";
import { submission_queue } from "./utils/constants";
import submissionProducer from "./producers/submission.producer";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    logger.info(`server started on ${serverConfig.PORT}`);
    logger.info(`Bullboard dashboard running on http://localhost:${serverConfig.PORT}/admin/queues`);

    submissionWorker(submission_queue);
    
    
    const code = `
        #include<iostream>
        using namespace std;

        int main(){
            int x;
            cin>>x;
            cout<<"value of x is: "<<x<<endl;
            for(int i=0; i<x; i++){
                cout<<i<<"\\\\n";
            }
            cout<<endl;
        }
    `;
    const inputCase = "10";
    submissionProducer({"1234":{
        language:"CPP",
        code,
        inputCase
    }});
    // runCpp(code, "10");
    // runJava(code, "100");
    // runPython(code, "100\n200");
});
