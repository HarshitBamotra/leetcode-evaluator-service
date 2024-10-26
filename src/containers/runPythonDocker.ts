import Docker from "dockerode";
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory";
import { PYTHON_IMAGE } from "../utils/constants";
import logger from "../config/logger.config";
import decodeDockerStream from "./docker.helper";

async function runPython(code: string, inputTestCase: string) {
    const rawLogBuffer: Buffer[] = [];

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase}' | python3 test.py`;
    console.log(runCommand);
    // const pythonContainer = await createContainer(PYTHON_IMAGE, [
    //     "python3",
    //     "-c",
    //     code,
    //     "stty -echo",
    // ]);
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
    await new Promise((res) => {
        loggerStream.on("end", () => {
            // console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            res(decodedStream);
        });
    });

    await pythonContainer.remove();
}
export default runPython;
