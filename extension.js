// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Q = require('q');
const QRCode = require('qrcode');
const { spawn } = require('child_process');

function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'git-code-statistic.helloworld',
    function () {
      const git = new GitTools(__dirname);
      git.remote().then((remote)=>{
        if(remote){
          git.status().then((result) => {
            console.log(result);
            // vscode.window.showInformationMessage(result);
          })
        } else {
          console.error("git no remote")
        }
      })
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
    console.log("first", cwd)
  }
  async remote(){
    try {
      var params = ['remote', '-v'];
      let result = await this.startChildProcess('git', params);
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
