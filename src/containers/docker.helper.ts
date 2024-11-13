import Dockerode from "dockerode";
import { DockerStreamOutput } from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
    // keeps track of current position in the buffer while parsing
    let offset = 0;

    // stores the accumulated stdout and stderr outputs as strings
    const output: DockerStreamOutput = { stdout: "", stderr: "" };

    // loop until offset reaches end of buffer
    while (offset < buffer.length) {
        // contains value of type of stream
        const channel = buffer[offset];

        // holds length of value
        // We will read this variable on a offset of 4 bytes from the start of the chunk
        const length = buffer.readUint32BE(offset + 4);

        // We read header, now moving to read value of chunk
        offset += DOCKER_STREAM_HEADER_SIZE;

        if (channel == 1) {
            // stdout stream
            output.stdout += buffer.toString("utf-8", offset, offset + length);
        } else if (channel == 2) {
            // stderr stream
            output.stderr += buffer.toString("utf-8", offset, offset + length);
        }

        offset += length;
    }
    return output;
}

export async function fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string>{
    

    return new Promise((res, rej) => {
        const timeout = setTimeout(()=>{
            console.log("timeout called");
            rej("TLE");
            
        }, 10000);
        loggerStream.on("end", () => {
            clearTimeout(timeout);
            // console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            
            if(decodedStream.stderr){
                rej(decodedStream.stderr);
            }
            else{
                res(decodedStream.stdout);
            }
        });
    });
}