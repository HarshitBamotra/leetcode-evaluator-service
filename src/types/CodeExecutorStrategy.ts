export default interface CodeExecutorStrategy{
    execute(code: string, input: string, output: string) : Promise<ExecutionResponse>
};

export type ExecutionResponse = {output: string, status: string};