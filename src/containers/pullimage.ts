import Docker from "dockerode";

export default async function pullImage(imagename: string) {
    try {
        const docker = new Docker();
        return new Promise((res, rej) => {
            docker.pull(imagename, (err: Error, stream: NodeJS.ReadStream) => {
                if (err) {
                    throw err;
                }
                docker.modem.followProgress(stream, (err, response) => {
                    if (err) {
                        rej(err);
                    }
                    res(response);
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}
