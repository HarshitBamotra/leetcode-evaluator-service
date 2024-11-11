import Docker from "dockerode";
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory";
import { CPP_IMAGE } from "../utils/constants";
import logger from "../config/logger.config";
import decodeDockerStream, { fetchDecodedStream } from "./docker.helper";
import pullImage from "./pullimage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";


class CppExecutor implements CodeExecutorStrategy{
    async execute(code: string, input: string, output: string): Promise<ExecutionResponse> {
        await pullImage(CPP_IMAGE);

        const rawLogBuffer: Buffer[] = [];
        console.log(code);

        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${input}' | ./main`;

        const cppContainer = await createContainer(CPP_IMAGE, [
            "/bin/sh",
            "-c",
            runCommand,
        ]);

        await cppContainer.start();
        logger.info("started the conatiner");

        const loggerStream = await cppContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true
        });

        loggerStream.on("data", (chunk) => {
            rawLogBuffer.push(chunk);
        });

        try {
            const codeResponse : string = await fetchDecodedStream(loggerStream, rawLogBuffer);
            return {output: codeResponse, status: "completed"};

        } catch (error) {
            return {output: error as string, status: "error"};
        }
        finally{
            await cppContainer.remove();
        }
    }

}

export default CppExecutor;
