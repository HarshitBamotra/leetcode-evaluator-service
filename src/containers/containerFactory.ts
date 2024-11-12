import Docker from "dockerode";
import serverConfig from "../config/server.config";

async function createContainer(imageName: string, cmdExecutable: string[]) {
    const docker = new Docker({ socketPath: serverConfig.DOCKER_SOCKET_PATH});

    const container = await docker.createContainer({
        Image: imageName,
        Cmd: cmdExecutable,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        OpenStdin: true,
        HostConfig:{
            Memory: 1024 * 1024 * 512 // 512 MB
        }
    });

    return container;
}

export default createContainer;
