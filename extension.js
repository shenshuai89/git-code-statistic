const vscode = require('vscode');
const Q = require('q');
const QRCode = require('qrcode');
const { spawn, exec } = require('child_process');
const util = require('util');
const execPromisify = util.promisify(exec);

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'git-code-statistic.helloworld',
    function () {
      const git = new GitTools(__dirname);
      git.logMonth().then((result) => {
        console.log(result);
        // vscode.window.showInformationMessage(result);
      });
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
        console.log(this.user, "username");
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
      let result =await execPromisify(`git log --author="shenshuai_dr" --pretty=tformat: --numstat --since=2024-3-01 --until=2024-3-31`, { cwd: this.cwd });
      console.log(result, "log month result");
      // let statisRes = await execPromisify(`${result} | awk "{ add += $1; subs += $2; all += $1 + $2 } END { printf '添加行: %s, 移除行: %s, 总计(添加-移除): %s\n', add, subs, all }"`)
      // console.log(statisRes, "log month result");
      return result;
    } catch (err) {
      console.error(err);
    }
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
