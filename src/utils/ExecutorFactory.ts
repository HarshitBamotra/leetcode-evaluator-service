import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/JavaExecutor";
import PythonExecutor from "../containers/pythonExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

export default function createExecutor(codeLanguage: string) : CodeExecutorStrategy | null{
    if(codeLanguage.toLowerCase() === "python"){
        return new PythonExecutor();
    }
    else if(codeLanguage.toLowerCase() === "java"){
        return new JavaExecutor();
    }
    else if(codeLanguage.toLowerCase() === "c_cpp"){
        return new CppExecutor();
    }
    else{
        return null;
    }
}