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

const git = new GitTools(workspace.workspaceFolders![0].uri.fsPath);
export function activate(context: ExtensionContext) {
  window.createTreeView('gitcode-userlist', {
    treeDataProvider: new TreeProvider(),
  });

  const ChartJSSrc: unknown = Uri.file(
    path.join(context.extensionPath, 'resources', 'Chart.bundle.min.js')
  ).with({ scheme: 'vscode-resource' });

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
    commands.registerCommand(`userList.refresh`, () => {
      // console.log(workspace!.workspaceFolders![0].uri.fsPath, 'refresh to git');
      // 刷新数据列表
      window.createTreeView('gitcode-userlist', {
        treeDataProvider: new TreeProvider(),
      });
    }),
    commands.registerCommand(`userList.item.search`, (user) => {
      let userName = user.label.split(' ')[0];
      // searchByDate(userName);
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
            searchBySetDate(
              userName,
              dayjs().add(-5, 'month').startOf('month').format('YYYY-MM-DD'),
              dayjs().endOf('month').format('YYYY-MM-DD'),
              ChartJSSrc as string
            );
          } else {
            // 自定义日期
            searchByDate(userName);
          }
        });
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
                  currentPanel.webview.html = setPanelHtml(
                    userName,
                    since,
                    until,
                    result
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
                  currentPanel.webview.html = setPanelHtml(
                    userName,
                    since,
                    until,
                    result
                  );
                }
              });
          }
        );
      }
    }
  );
}
function searchBySetDate(
  userName: string,
  since: object | string,
  until: object | string,
  ChartJSSrc?: string
) {
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
        currentPanel.webview.html = setPanelHtml(
          userName,
          since,
          until,
          result,
          ChartJSSrc
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
        currentPanel.webview.html = setPanelHtml(
          userName,
          since,
          until,
          result,
          ChartJSSrc
        );
      }
    });
}

const setPanelHtml = (
  userName: string,
  since: object | string,
  until: object | string,
  result: unknown,
  ChartJSSrc?: string
) => {
  return `
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>git code analysis</title>
      </head>
      <body>
        ${ChartJSSrc ? `<canvas id="myGitChat" height="400" width="660"></canvas>` : ''}       
        <h3>git code analysis</h3>
        <p>The project submitted code line by <b>${userName}</b> from <b>${since}</b> to <b>${until}</b> is as follows</p>
        <div style='font-size: 18px;'>${(result as string).slice(5)}</div>
        <script type="text/javascript">
          let canvas = document.getElementById('myGitChat');
          let ctx = canvas.getContext('2d');
          
          function draw(){
            var x0=30,//x轴0处坐标
              y0=360,//y轴0处坐标
              x1=620,//x轴顶处坐标
              y1=30,//y轴顶处坐标
              dis=90, //柱子间距
              barWidth=60;

            //先绘制X和Y轴
            ctx.beginPath();
            ctx.lineWidth=1; 
          
            ctx.moveTo(x0,y1);//笔移动到Y轴的顶部
            ctx.lineTo(x0,y0);//绘制Y轴
            ctx.lineTo(x1,y0);//绘制X轴
            ctx.stroke();
            // ctx.fillStyle = '#3498db';
            // ctx.fillRect(20, 20, 145, 85);

            // ctx.fillStyle = '#1bbc9d';
            // ctx.fillRect(200, 20, 145, 85);
            let colors = ['#3498db', '#1bbc9d', '#eab5a9', '#e7ceb6', '#c6eed2', '#b0e6e3']
            for(let i = 0; i <6; i++){
              ctx.fillStyle = colors[i];
              ctx.fillText((i+1)+'月份', x0 + 50 + i * dis, y0+15);
              ctx.fillRect(x0 + 30 + i * dis, 360, barWidth, -(85+i*30));
              ctx.fillText(85+i*30, x0 + 50 + i * dis, y0-(95+i*30));
            }
          }
          draw();
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

// This method is called when your extension is deactivated
export function deactivate() {}
