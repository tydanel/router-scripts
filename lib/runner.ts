import { exec, ExecOptions, ChildProcess } from "child_process";

export default class SshCommand {
  private sshCommand: string;
  private command: string;
  private options?: ExecOptions;
  private childProcess?: ChildProcess;

  constructor(command: string, options?: ExecOptions) {
    this.sshCommand = `ssh -i ${process.env.ROUTER_KEY} ${process.env.ROUTER_USER}@${process.env.ROUTER_IP}`;
    this.command = command;
    this.options = options;
  }

  public execute(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fullCommand = `${this.sshCommand} "${this.command}"`;
      this.childProcess = exec(fullCommand, Object.assign({}, this.options));

      this.childProcess.on("error", (err) => {
        reject(err);
      });
      // @ts-ignore  can be igored because its stdout+stderror are only null
      // if set to anything besides pipe
      this.childProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });
      // @ts-ignore
      this.childProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      this.childProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command exited with code ${code}`));
        }
      });
    });
  }

  public abort(): void {
    if (this.childProcess) {
      this.childProcess.kill();
    }
  }
}