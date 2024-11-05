import Docker from "dockerode";
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory";
import { CPP_IMAGE } from "../utils/constants";
import logger from "../config/logger.config";
import decodeDockerStream from "./docker.helper";
import pullImage from "./pullimage";

async function runCpp(code: string, inputTestCase: string) {
    await pullImage(CPP_IMAGE);

    const rawLogBuffer: Buffer[] = [];
    console.log(code);

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase}' | ./main`;

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
    const response = await new Promise((res) => {
        loggerStream.on("end", () => {
            // console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            res(decodedStream);
        });
    });

    await cppContainer.remove();

    return response;
}
export default runCpp;
