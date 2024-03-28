import { spawn, exec, spawnSync } from 'child_process';
import dayjs = require('dayjs');
import { resolve } from 'path';

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
  async logMonth(params: any) {
    // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
    // 根据日期，作者，统计代码的提交行数
    const res: unknown = await this.startChildProcessNoParams(
      `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until}`
    );
    let resArr: any[] = [];
    (res as string).split('\n').forEach((item: any) => {
      item && resArr.push(item.split('\t'));
    });
    if (resArr.length === 0) {
      return 'No submitted data！';
    }
    // 处理添加行数据
    let addLineNum = resArr.reduce((pre, current) => {
      return (
        (isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
        (isNaN(parseInt(current[0])) ? 0 : parseInt(current[0]))
      );
    }, 0);
    // 处理删除行数据
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
  // 跨越多个月份
  async logAcrossMonths(userName: string, since: string, until: string) {
    let resultArr: Array<{ date: string; value: number | null }> = [];
    let monthArr: any[] = [];
    monthArr.push({
      label: dayjs(since).format('YYYY-MM'),
      start: since,
      end: dayjs(since).endOf('month').format('YYYY-MM-DD'),
    });
    let diff = dayjs(until).diff(since, 'month');
    for (let i = 1; i <= diff; i++) {
      monthArr.push({
        label: dayjs(since).add(i, 'month').format('YYYY-MM'),
        start: dayjs(since)
          .add(i, 'month')
          .startOf('month')
          .format('YYYY-MM-DD'),
        end: dayjs(since).add(i, 'month').endOf('month').format('YYYY-MM-DD'),
      });
    }
    if (
      monthArr[monthArr.length - 1].label !== dayjs(until).format('YYYY-MM')
    ) {
      monthArr.push({
        label: dayjs(until).format('YYYY-MM'),
        start: dayjs(until).startOf('month').format('YYYY-MM-DD'),
        end: until,
      });
    }

    /* await Promise.all(fileNames.map(async (file) => {
      const contents = await fs.readFile(file, 'utf8');
      console.log(contents);
    })); */

    const promiseAll = await Promise.all(
      monthArr.map(async (item) => {
        let res: any = await this.startChildProcessNoParams(
          `git log --author="${userName}" --pretty=tformat: --numstat --since=${item.start} --until=${item.end}`
        );
        if (res.length === '') {
          resultArr.push({
            date: item.label,
            value: null,
          });
        }
        let resArr: any[] = [];
        (res as string).split('\n').forEach((item: any) => {
          item && resArr.push(item.split('\t'));
        });

        // 处理添加行数据
        let addLineNum = resArr.reduce((pre, current) => {
          return (
            (isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
            (isNaN(parseInt(current[0])) ? 0 : parseInt(current[0]))
          );
        }, 0);
        // 处理删除行数据
        let delLineNum = resArr.reduce((pre, current) => {
          return (
            (isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
            (isNaN(parseInt(current[1])) ? 0 : parseInt(current[1]))
          );
        }, 0);
        resultArr.push({
          date: item.label,
          value: addLineNum + delLineNum,
        });
        return resultArr;
      })
    );
    // 查询代码量

    // let returnVal = resultArr.filter((item) => Boolean(item.value));
    // resolve(returnVal)
    return promiseAll[0].filter((item) => Boolean(item.value));
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
        `git log --pretty=format:"%an <%ae>"| sort -u`
      );
      let resArr = (res as string).split('\n');
      let resSet = new Set();
      resArr.forEach((item) => {
        item && resSet.add(item);
      });

      return [...resSet]
        .sort((a: unknown, b: unknown) => {
          return (a as string)[0] > (b as string)[0] ? 1 : -1;
        })
        .join('\n');
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
  startChildProcessNoParams(command: string) {
    return new Promise((resolve, reject) => {
      var process = spawnSync(command, {
        cwd: this.cwd,
        shell: true,
        encoding: 'utf8',
      });

      var logMessage = `${command}`;
      var cmdMessage = '';
      if (process.error) {
        console.log('ERROR: ', process.error);
        reject(process.error);
      }
      resolve(process.stdout);
    });
  }
}
