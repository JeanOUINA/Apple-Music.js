import * as child_process from "child_process";

export function executeScript(script: string, args: string[] = []): Promise<string> {
    return new Promise((resolve, reject) => {
        const command = "osascript";
        const child = child_process.spawn(command, [
            "-e", script,
            ...args
        ], {
            stdio: ["ignore", "pipe", "inherit"]
        })

        let result = "";
        child.stdout.on("data", function (data) {
            result += data.toString();
        })

        child.on("close", function (code) {
            if(code === 0){
                if(result.endsWith("\n")){
                    result = result.substring(0, result.length - 1);
                }
                resolve(result);
            }else{
                reject(new Error("osascript exited with code " + code));
            }
        })
    })
}