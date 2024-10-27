import Docker from "dockerode";
import { TestCases } from "../types/testCases";
import createContainer from "./containerFactory";
import { JAVA_IMAGE } from "../utils/constants";
import logger from "../config/logger.config";
import decodeDockerStream from "./docker.helper";
import pullImage from "./pullimage";

async function runJava(code: string, inputTestCase: string) {
    await pullImage(JAVA_IMAGE);

    const rawLogBuffer: Buffer[] = [];

    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase}' | java Main`;
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
    await new Promise((res) => {
        loggerStream.on("end", () => {
            // console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            res(decodedStream);
        });
    });

    await javaContainer.remove();
}
export default runJava;
