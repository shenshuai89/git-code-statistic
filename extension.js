const vscode = require('vscode');
const Q = require('q');
const QRCode = require('qrcode');
const { spawn, exec } = require('child_process');
const util = require('util');
const execPromisify = util.promisify(exec);
const shelljs = require('shelljs');
// const { DependenciesProvider, TreeDataProvider} = require("./TreeProvider.js")

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'git-code-statistic.helloworld',
    function () {
      // const git = new GitTools(__dirname);
      // console.log(vscode.workspace.workspaceFolders[0].uri.fsPath, "pathpath to git")
      const git = new GitTools(vscode.workspace.workspaceFolders[0].uri.fsPath);
      getSelectedTextOrPrompt('输入作者').then(function (author) {
        if(!author){
          return;
        }else {
          getSelectedTextOrPrompt('输入开始时间').then(function (since) {
            if(!since){
              return
            }else {
              getSelectedTextOrPrompt('输入结束时间').then(function (until) {
                if(!until){
                  return
                }
                git.testAwk({
                  author: author,
                  since: since,
                  until: until,
                }).then((result) => {
                  console.log(result, 'git-code-statistic.helloworld');

                  /* 新创建一个页面，用了存放生成的数据 */
                  const panel = vscode.window.createWebviewPanel(
                    'git-code-statistic', // 只供内部使用，这个 webview 的标识
                    'git code statistic', // 给用户显示的面板标题
                    vscode.ViewColumn.one, // 给新的 webview 面板一个编辑器视图
                    {
                      enableScripts: true, // 启用 javascript 脚本
                      retainContextWhenHidden: true, // 隐藏时保留上下文
                    } // webview 面板的内容配置
                  );
                  panel.webview.html = result.slice(5);
                  // 显示提示框
                  // vscode.window.showInformationMessage(result);
                });
              })
            }
          })
        }
      });
      // vscode.window.showInformationMessage(git.testAwk());
      /* getSelectedTextOrPrompt('Text to convert into QR code').then((text) => {
        if (!text) {
          return;
        }
        // 将文本转换为二维码图片
        QRCode.toDataURL(
          text,
          { errorCorrectionLevel: 'L' },
          function (err, url) {
            if (!err) {
              // 在新标签页展现二维码图片
              const panel = vscode.window.createWebviewPanel(
                'Text2QRCode',
                'Text2QRCode',
                vscode.ViewColumn.One,
                {}
              );
              panel.webview.html = getPreviewHtml(url);
            } else {
              vscode.window.showErrorMessage(err.message);
            }
          }
        );
      }); */
    }
  );

  context.subscriptions.push(disposable);
}

class GitTools {
  constructor(cwd) {
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
  async logMonth() {
    try {
      // var params = ['log', `--author="shenshuai_dr" --pretty=tformat: --numstat --since=2024-3-01 --until=2024-3-31 | ${awk} "{ add += $1; subs += $2; all += $1 + $2 } END { printf '添加行: %s, 移除行: %s, 总计(添加-移除): %s\n', add, subs, all }"`];
      var params = ['log', `--author=${this.user} --pretty=tformat: --numstat`];
      let result = await execPromisify(
        `git log --author="shenshuai_dr" --pretty=tformat: --numstat --since=2024-3-01 --until=2024-3-31`,
        { cwd: this.cwd }
      );
      console.log(result, 'log month result');
      // let statisRes = await execPromisify(`${result} | awk "{ add += $1; subs += $2; all += $1 + $2 } END { printf '添加行: %s, 移除行: %s, 总计(添加-移除): %s\n', add, subs, all }"`)
      // console.log(statisRes, "log month result");
      return result;
    } catch (err) {
      console.error(err);
    }
  }
  async testAwk(params) {
    // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
    const res = await this.startChildProcessNoParams(
      `git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`,
      { shell: true }
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
  checkout(branch) {}

  newBranch(branchName) {}

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
  startChildProcess(command, params) {
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

      process.on('close', (data, e1, e2, e3) => {
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
  startChildProcessNoParams(command) {
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

      process.on('close', (data, e1, e2, e3) => {
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

// 展现二维码图片
function getPreviewHtml(image) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Text2QRCode</title>
    </head>
    <body>
    <div style="display: flex; min-height: 240px; height: 100%; width: 100%;">
        <div style="display: flex; flex: 1; flex-direction: column; justify-content: center;">
            <img src="${image}" style="align-self: center;" />
        </div>
    </div>
    </body>
    </html>`;
}
// 获取当前选中内容 或者 提示用户输入
function getSelectedTextOrPrompt(prompt) {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor) {
    const selection = activeTextEditor.selection,
      start = selection.start,
      end = selection.end;
    if (start.line !== end.line || start.character !== end.character) {
      return Q(activeTextEditor.document.getText(selection));
    }
  }
  return vscode.window.showInputBox({ prompt });
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
