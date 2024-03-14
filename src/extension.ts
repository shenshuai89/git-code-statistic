import {
  ExtensionContext,
  commands,
  window,
  workspace,
  ViewColumn,
  WebviewPanel,
} from 'vscode';
import { GitTools } from './gitTools';
import TreeProvider from './treeData';

const git = new GitTools(workspace.workspaceFolders![0].uri.fsPath);
export function activate(context: ExtensionContext) {
  window.createTreeView('gitcode-userlist', {
    treeDataProvider: new TreeProvider(),
  });
  let disposable = commands.registerCommand(
    'git-code-statistic.gitcode',
    async function () {
      // const git = new GitTools(__dirname);
      // console.log(workspace.workspaceFolders[0].uri.fsPath, "pathpath to git")
      getSelectedTextOrPrompt('输入作者').then(function (author) {
        if (!author) {
          return;
        } else {
          searchByDate(author as string);
          /* getSelectedTextOrPrompt('输入开始时间').then(function (since) {
            if (!since) {
              return;
            } else {
              getSelectedTextOrPrompt('输入结束时间').then(function (until) {
                if (!until) {
                  return;
                }
                git
                  .logMonth({
                    author: author,
                    since: since,
                    until: until,
                  })
                  .then((result) => {
                    console.log(result, 'git-code-statistic.gitcode');

                    // 新创建一个页面，用了存放生成的数据 
                    const panel = window.createWebviewPanel(
                      'git-code-statistic', // 只供内部使用，这个 webview 的标识
                      'git code statistic', // 给用户显示的面板标题
                      ViewColumn.One, // 给新的 webview 面板一个编辑器视图
                      {
                        enableScripts: true, // 启用 javascript 脚本
                        retainContextWhenHidden: true, // 隐藏时保留上下文
                      } // webview 面板的内容配置
                    );
                    panel.webview.html = (result as string).slice(5);
                    // 显示提示框
                    // vscode.window.showInformationMessage(result);
                  });
              });
            }
          }); */
        }
      });
    }
  );

  context.subscriptions.push(
    disposable,
    commands.registerCommand(`userList.add`, () => {
      console.log(workspace!.workspaceFolders![0].uri.fsPath, 'add to git');
    }),
    commands.registerCommand(`userList.item.remove`, (user) => {
      let userName = user.label.split(' ')[0];
      console.log(user, 'remove removeremoveremove');
      searchByDate(userName);
    })
  );
}

// 追踪当前 webview 面板
let currentPanel: WebviewPanel | undefined = undefined;
function searchByDate(userName: string) {
  getSelectedTextOrPrompt('输入开始时间,如2020-01-31或2020/01/31').then(
    function (since) {
      if (!since) {
        return;
      } else {
        getSelectedTextOrPrompt('输入结束时间，如2080-01-31或2080/01/31').then(
          function (until) {
            if (!until) {
              return;
            }
            git
              .logMonth({
                author: userName,
                since: since,
                until: until,
              })
              .then((result) => {
                // 获取当前活动的编辑器
                const columnToShowIn = window.activeTextEditor
                  ? window.activeTextEditor.viewColumn
                  : undefined;
                if (currentPanel) {
                  // 如果我们已经有了一个面板，那就把它显示到目标列布局中
                  // currentPanel.reveal(columnToShowIn);
                  // 当前面板被关闭后重置
                  // 先进行销毁
                  currentPanel!.dispose();
                  /* 新创建一个页面，用了存放生成的数据 */
                  currentPanel = window.createWebviewPanel(
                    'git-code-statistic', // 只供内部使用，这个 webview 的标识
                    'git code statistic', // 给用户显示的面板标题
                    ViewColumn.One, // 给新的 webview 面板一个编辑器视图
                    {
                      enableScripts: true, // 启用 javascript 脚本
                      retainContextWhenHidden: true, // 隐藏时保留上下文
                    } // webview 面板的内容配置
                  );
                  currentPanel.webview.html = setPanelHtml(userName, since, until, result);
                } else {
                  /* 新创建一个页面，用了存放生成的数据 */
                  currentPanel = window.createWebviewPanel(
                    'git-code-statistic', // 只供内部使用，这个 webview 的标识
                    'git code statistic', // 给用户显示的面板标题
                    ViewColumn.Active, // 给新的 webview 面板一个编辑器视图
                    {
                      enableScripts: true, // 启用 javascript 脚本
                      retainContextWhenHidden: true, // 隐藏时保留上下文
                    } // webview 面板的内容配置
                  );
                  currentPanel.webview.html = setPanelHtml(userName, since, until, result);
                }
              });
          }
        );
      }
    }
  );
}

const setPanelHtml = (
  userName: string,
  since: object,
  until: object,
  result: unknown
) => {
  return `
    <html>
      <body>
        <h3>git code analysis</h3>
        <p>The project submitted code line by <b>${userName}</b> from <b>${since}</b> to <b>${until}</b> is as follows</p>
        <div style='font-size: 18px;'>${(result as string).slice(5)}</div>
      </body>
    </html>
  `;
};

// 获取当前选中内容 或者 提示用户输入
function getSelectedTextOrPrompt(prompt: string) {
  return new Promise((resolve, reject) => {
    const activeTextEditor = window.activeTextEditor;
    if (activeTextEditor) {
      const selection = activeTextEditor.selection,
        start = selection.start,
        end = selection.end;
      console.log(activeTextEditor, 'selection');
      if (start.line !== end.line || start.character !== end.character) {
        return resolve(activeTextEditor.document.getText(selection));
      }
    }
    return resolve(window.showInputBox({ prompt }));
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
