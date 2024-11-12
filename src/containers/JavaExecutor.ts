import Docker from "dockerode";
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import logger from "../config/logger.config";
import decodeDockerStream, { fetchDecodedStream } from "./docker.helper";
import pullImage from "./pullimage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";


class JavaExecutor implements CodeExecutorStrategy{
    async execute(code: string, input: string, output: string): Promise<ExecutionResponse> {
        await pullImage(JAVA_IMAGE);

        const rawLogBuffer: Buffer[] = [];

        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${input}' | java Main`;
        console.log(runCommand);

        const javaContainer = await createContainer(JAVA_IMAGE, [
            "/bin/sh",
            "-c",
            runCommand,
        ]);

        await javaContainer.start();
        logger.info("started the conatiner");

        const loggerStream = await javaContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true,
        });

        loggerStream.on("data", (chunk) => {
            rawLogBuffer.push(chunk);
        });

        try {
            const codeResponse : string = await fetchDecodedStream(loggerStream, rawLogBuffer);

            if(codeResponse.trim() === output.trim()){
                return {output: codeResponse, status: "success"};    
            }
            else{
                return {output: codeResponse, status: "wa"};
            }

        } catch (error) {
            console.log(error);
            if(error === "TLE"){
                await javaContainer.kill();
            }
            return {output: error as string, status: "error"};
        }
        finally{
            await javaContainer.remove();
        }

    }

}

export default JavaExecutor;
