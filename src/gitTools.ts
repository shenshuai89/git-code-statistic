import { spawn, exec } from 'child_process';

export class GitTools {
    private cwd: string;
    private user: string;
  constructor(cwd: string) {
    this.cwd = cwd;
    this.user = '';
    this.init();
  }
  async init() {
    this.startChildProcess('git', ['remote', '-v'])
      .then(async (res) => {
        this.user = await this.startChildProcess('git', [
          'config',
          'user.name',
        ]);
        console.log(this.user, 'username');
      })
      .catch((err) => {
        console.error('git no remote', err);
      });
  }
  async remote() {
    try {
      var params = ['remote', '-v'];
      let result = await this.startChildProcess('git', params);
      return result;
    } catch (err) {
      console.error(err);
    }
  }
  async logMonth(params:any) {
    // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
    const res = await this.startChildProcessNoParams(
      `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`,
    );
    return res;
  }
  async testAwk1(params: any) {
    // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
    const res = await this.startChildProcessNoParams(
      `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`,
    );
    return res;
    // return "testAwk";
    // 测试awk命令的执行
    // echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'
    // return execPromisify(`echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'`, { cwd: this.cwd });
  }
  async branch() {
    try {
      var params = ['branch', '-a'];
      let result = await this.startChildProcess('git', params);
      return result.toString();
    } catch (err) {
      console.error(err);
    }

    return false;
  }
  async allUser() {
    // git log --pretty=format:"%an <%ae>"| sort -u
    try {
      const res = await this.startChildProcessNoParams(
        `git log --pretty=format:"%an <%ae>"| sort -u`,
      );
      return res;
    } catch (err) {
      console.error(err);
    }
    return false;
  }

  async status() {
    try {
      var params = ['status', '-s'];
      let result = await this.startChildProcess('git', params);
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
      var cmdMessage = '';

      process.stdout.on('data', (data) => {
        console.log(`${logMessage} start ---`, data);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      });

      process.on('close', (data) => {
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
  startChildProcessNoParams(command:string) {
    return new Promise((resolve, reject) => {
      var process = spawn(command, {
        cwd: this.cwd,
        shell: true,
      });

      var logMessage = `${command}`;
      var cmdMessage = '';

      process.stdout.on('data', (data) => {
        console.log(`${logMessage} start ---`, data);
        if (!data) {
          reject(`${logMessage} error1 : ${data}`);
        } else {
          cmdMessage = data.toString();
        }
      });

      process.on('close', (data) => {
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
}