import { spawn, exec, spawnSync } from "child_process";

export class GitTools {
  private cwd: string;
  private user: string;
  constructor(cwd: string) {
    this.cwd = cwd;
    this.user = "";
    this.init();
  }
  async init() {
    this.startChildProcess("git", ["remote", "-v"])
      .then(async (res) => {
        this.user = await this.startChildProcess("git", [
          "config",
          "user.name",
        ]);
        console.log(this.user, "username");
      })
      .catch((err) => {
        console.error("git no remote", err);
      });
  }
  async remote() {
    try {
      var params = ["remote", "-v"];
      let result = await this.startChildProcess("git", params);
      return result;
    } catch (err) {
      console.error(err);
    }
  }
  async logMonth(params: any) {
    // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
    // `git log --author="Acris" --pretty=tformat: --numstat --since=2010-02-01 --until=2024-02-29`
    // `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} `
    const res = await this.startChildProcessNoParams(
      `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until}`
    );
    let resArr = [];
    res.split("\n").forEach((item) => {
      item && resArr.push(item.split("\t"));
    });
    let addLineNum = resArr.reduce((pre, current) => {
      return (
        (isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
        (isNaN(parseInt(current[0])) ? 0 : parseInt(current[0]))
      );
    }, 0);
    let delLineNum = resArr.reduce((pre, current) => {
      return (
        (isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
        (isNaN(parseInt(current[1])) ? 0 : parseInt(current[1]))
      );
    }, 0);
    return `add line: ${addLineNum} remove line: ${delLineNum} total edit line: ${
      addLineNum + delLineNum
    }`;
  }
  async testAwk1(params: any) {
    // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
    const res = await this.startChildProcessNoParams(
      `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "add line: "add " remove line: "subs " all line: all "all }'`
    );
    return res;
    // return "testAwk";
    // 测试awk命令的执行
    // echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'
    // return execPromisify(`echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'`, { cwd: this.cwd });
  }
  async branch() {
    try {
      var params = ["branch", "-a"];
      let result = await this.startChildProcess("git", params);
      return result.toString();
    } catch (err) {
      console.error(err);
    }

    return false;
  }
  async allUser() {
    // git log --pretty=format:"%an <%ae>"| sort -u
    try {
      const res: unknown = await this.startChildProcessNoParams(
        `git log --pretty=format:"%an <%ae>"`
      );
      let resArr = (res as string).split("\n");
      let resSet = new Set();
      resArr.forEach((item) => {
        item && resSet.add(item);
      });

      return [...resSet]
        .sort((a: unknown, b: unknown) => {
          return (a as string)[0] > (b as string)[0] ? 1 : -1;
        })
        .join("\n");
    } catch (err) {
      console.error(err);
    }
    return false;
  }

  async status() {
    try {
      var params = ["status", "-s"];
      let result = await this.startChildProcess("git", params);
      return result;
    } catch (err) {
      console.error(err);
    }

    return false;
  }
  startChildProcess(command: string, params: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      var process = spawn(command, params, {
        cwd: this.cwd,
        shell: true,
      });

      var logMessage = `${command} ${params[0]}`;
      var cmdMessage = "";

      process.stdout.on("data", (data) => {
        console.log(`${logMessage} start ---`, data);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      });

      process.on("close", (data) => {
        console.log(`${logMessage} close ---`, data);
        if (data) {
          reject(`${logMessage} error2 ! ${data}`);
        } else {
          console.log(`${logMessage} success !`);
          resolve(cmdMessage);
        }
      });
    });
  }
  startChildProcessNoParams(command: string) {
    return new Promise((resolve, reject) => {
      var process = spawnSync(command, {
        cwd: this.cwd,
        shell: true,
        encoding: "utf8",
      });

      var logMessage = `${command}`;
      var cmdMessage = "";
      if (process.error) {
        console.log("ERROR: ", process.error);
      }
      resolve(process.stdout);
      // process.stdout.on("data", (data) => {
      //   console.log(`${logMessage} start ---`, data);
      //   if (!data) {
      //     reject(`${logMessage} error1 : ${data}`);
      //   } else {
      //     cmdMessage = data.toString();
      //   }
      // });

      // process.on("close", (data) => {
      //   console.log(`${logMessage} close ---`, data);
      //   if (data) {
      //     reject(`${logMessage} error2 ! ${data}`);
      //   } else {
      //     console.log(`${logMessage} success !`);
      //     resolve(cmdMessage);
      //   }
      // });
    });
  }
}
