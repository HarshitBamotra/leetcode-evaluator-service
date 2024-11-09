import Docker from "dockerode";
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import logger from "../config/logger.config";
import decodeDockerStream, { fetchDecodedStream } from "./docker.helper";
import pullImage from "./pullimage";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";


class PythonExecutor implements CodeExecutorStrategy{
    async execute(code: string, input: string): Promise<ExecutionResponse> {
        pullImage(PYTHON_IMAGE);

        const rawLogBuffer: Buffer[] = [];

        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${input}' | python3 test.py`;
        console.log(runCommand);

        const pythonContainer = await createContainer(PYTHON_IMAGE, [
            "/bin/sh",
            "-c",
            runCommand,
        ]);

        await pythonContainer.start();
        logger.info("started the conatiner");

        const loggerStream = await pythonContainer.logs({
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
            return {output: codeResponse, status: "Completed"}

        } catch (error) {
            return {output: error as string, status: "Error"}
        }
        finally{
            await pythonContainer.remove();
        }

    }
}

export default PythonExecutor;
