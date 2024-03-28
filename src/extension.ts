import {
  ExtensionContext,
  commands,
  window,
  workspace,
  ViewColumn,
  WebviewPanel,
  QuickPickItem,
  Uri,
} from 'vscode';
import { GitTools } from './gitTools';
import TreeProvider from './treeData';
import * as dayjs from 'dayjs';
import * as path from 'path';
import * as fs from 'fs';

const git = new GitTools(workspace.workspaceFolders![0].uri.fsPath);
export function activate(context: ExtensionContext) {
  window.createTreeView('gitcode-userlist', {
    treeDataProvider: new TreeProvider(),
  });

  // const ChartJSSrc: unknown = path.join(context.extensionPath, 'resources', 'Chart.bundle.min.js')

  const ChartJSSrc: unknown = context.extensionPath;
  let disposable = commands.registerCommand(
    'git-code-statistic.gitcode',
    async function () {
      // const git = new GitTools(__dirname);
      // console.log(workspace.workspaceFolders[0].uri.fsPath, "pathpath to git")
      getSelectedTextOrPrompt('输入作者').then(function (author) {
        if (!author) {
          return;
        } else {
          searchByCustomDate(author as string);
        }
      });
    }
  );

  context.subscriptions.push(
    disposable,
    commands.registerCommand(`userList.refresh`, () => {
      // console.log(workspace!.workspaceFolders![0].uri.fsPath, 'refresh to git');
      // 刷新数据列表
      window.createTreeView('gitcode-userlist', {
        treeDataProvider: new TreeProvider(),
      });
    }),
    commands.registerCommand(`userList.item.search`, (user) => {
      let userName = user.label.split(' ')[0];
      // 打开一个快速选择列表
      window
        .showQuickPick(
          // ["选项一", "选项二", "选项三"], // 简单的显示多个选项
          [
            {
              // 对象的形式可以配置更多东西
              label: 'Current month',
              // 可以指定官方提供的图标id https://code.visualstudio.com/api/references/icons-in-labels#icon-listing
              // $(bug) 设置的是图标
              // description: "选项一描述$(bug)",
              detail: 'Submit code statistics current month',
            },
            {
              label: 'Last month',
              detail: 'Submit code statistics Last month',
            },
            {
              label: 'Past six months',
              detail: 'Submit code statistics Last six month',
            },
            {
              label: 'Custom date query',
              detail: 'setting custom query date ',
            },
          ],
          {
            title: 'Query date', // 标题
            placeHolder: 'Please select an option！', // 占位符文本
            canPickMany: false, // 是否可以多选
          }
        )
        .then((res: QuickPickItem | undefined) => {
          if (!res) return;
          const { label } = res;
          // console.log(res, userName, dayjs().format(), 'userNameuserName'); // 这里就是上面数组中对应的对象信息
          if (label === 'Current month') {
            searchBySetDate(
              userName,
              dayjs().startOf('month').format('YYYY-MM-DD'),
              dayjs().endOf('month').format('YYYY-MM-DD')
            );
          } else if (label === 'Last month') {
            searchBySetDate(
              userName,
              dayjs().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
              dayjs().add(-1, 'month').endOf('month').format('YYYY-MM-DD')
            );
          } else if (label === 'Past six months') {
            searchByCustomDate(
              userName,
              dayjs().add(-5, 'month').startOf('month').format('YYYY-MM-DD'),
              dayjs().endOf('month').format('YYYY-MM-DD')
            );
          } else {
            // 自定义日期
            searchByCustomDate(userName);
          }
        });
    })
  );
}

// 追踪当前 webview 面板
let currentPanel: WebviewPanel | undefined = undefined;
function createCurrentPanel() {
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
  }
}
function searchByCustomDate(userName: string, since?: string, until?: string) {
  // 创建当前面板
  createCurrentPanel();
  // 查询最近6个月的数据
  if (since && until) {
    git.logAcrossMonths(userName, since, until).then((result) => {
      currentPanel!.webview.html = setMoreMonthPanelHtml(
        userName,
        since,
        until,
        result
      );
    });
  } else {
    // 从用户输入的时间查询, 如2020-01-31或2020/01/31
    getSelectedTextOrPrompt('输入开始时间,如2020-01-31或2020/01/31').then(
      function (since) {
        if (!since) {
          return;
        } else {
          getSelectedTextOrPrompt(
            '输入结束时间，如2080-01-31或2080/01/31'
          ).then(function (until) {
            if (!until) {
              return;
            }
            // 判断间隔月份，是否大于2个月
            if (
              dayjs(until as string).diff(dayjs(since as string), 'month') < 1
            ) {
              // 只是在一个月的范围
              git
                .logMonth({
                  author: userName,
                  since: since,
                  until: until,
                })
                .then((result) => {
                  currentPanel!.webview.html = setPanelHtml(
                    userName,
                    since,
                    until,
                    result
                  );
                });
            } else {
              // 多月的范围
              git
                .logAcrossMonths(userName, since as string, until as string)
                .then((result: any) => {
                  console.log(result, 'result');
                  currentPanel!.webview.html = setMoreMonthPanelHtml(
                    userName,
                    since,
                    until,
                    result
                  );
                });
            }
          });
        }
      }
    );
  }
}
// 查询指定单月的数据
function searchBySetDate(
  userName: string,
  since: object | string,
  until: object | string
) {
  createCurrentPanel();
  git
    .logMonth({
      author: userName,
      since: since,
      until: until,
    })
    .then((result) => {
      currentPanel!.webview.html = setPanelHtml(userName, since, until, result);
    });
}

// 设置单月的显示数据
const setPanelHtml = (
  userName: string,
  since: object | string,
  until: object | string,
  result: unknown
) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>git code analysis</title>
      </head>
      <body>
        <h3 id="myTitle">git code analysis</h3>
        <p>The project submitted code line by <b>${userName}</b> from <b>${since}</b> to <b>${until}</b> is as follows</p>
        <div style='font-size: 18px;'>${result as string}</div>
      </body>
    </html>
  `;
};

// 设置多个月的显示数据
const setMoreMonthPanelHtml = (
  userName: string,
  since: object | string,
  until: object | string,
  result: unknown[]
) => {
  let labelsArr: any[] = [];
  let dataArr: any[] = [];
  result.forEach((item: any) => {
    labelsArr.push(item.date.replace('-', ''));
    dataArr.push(item.value);
  });
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>git code analysis</title>
      </head>
      <body>
        ${result.length > 0 ? `<canvas id="myGitChart" height="400" width="660"></canvas>` : ''}
        <h3 id="myTitle">git code analysis</h3>
        <p>The project submitted code line by <b>${userName}</b> from <b>${since}</b> to <b>${until}</b> is ${result.length > 0 ? 'above chart.' : 'no submit code.'} </p>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script type="text/javascript">
          let canvas = document.getElementById('myGitChart');
          let myTitle = document.getElementById('myTitle');
          new Chart(canvas, {
            type: 'bar',
            data: {
              labels: [${labelsArr}],
              datasets: [
                {
                  label: 'edit code line',
                  data: [${dataArr}],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
         
        </script>
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

function getWebViewContent(context: any, templatePath: any, panel: any) {
  const resourcePath = path.join(context.extensionPath, templatePath);
  const dirPath = path.dirname(resourcePath);
  let htmlIndexPath = fs.readFileSync(resourcePath, 'utf-8');

  const html = htmlIndexPath.replace(
    /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
    (m, $1, $2) => {
      const absLocalPath = path.resolve(dirPath, $2);
      const webviewUri = panel.webview.asWebviewUri(Uri.file(absLocalPath));
      const replaceHref = $1 + webviewUri.toString() + '"';
      return replaceHref;
    }
  );
  return html;
}

// This method is called when your extension is deactivated
export function deactivate() {}
