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
