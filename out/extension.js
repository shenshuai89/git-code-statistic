module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = __webpack_require__(1);
const gitTools_1 = __webpack_require__(2);
const treeData_1 = __webpack_require__(4);
const dayjs = __webpack_require__(5);
const path = __webpack_require__(6);
const fs = __webpack_require__(7);
const git = new gitTools_1.GitTools(vscode_1.workspace.workspaceFolders[0].uri.fsPath);
function activate(context) {
    vscode_1.window.createTreeView('gitcode-userlist', {
        treeDataProvider: new treeData_1.default(),
    });
    // const ChartJSSrc: unknown = path.join(context.extensionPath, 'resources', 'Chart.bundle.min.js')
    const ChartJSSrc = context.extensionPath;
    let disposable = vscode_1.commands.registerCommand('git-code-statistic.gitcode', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // const git = new GitTools(__dirname);
            // console.log(workspace.workspaceFolders[0].uri.fsPath, "pathpath to git")
            getSelectedTextOrPrompt('输入作者').then(function (author) {
                if (!author) {
                    return;
                }
                else {
                    searchByCustomDate(author);
                }
            });
        });
    });
    context.subscriptions.push(disposable, vscode_1.commands.registerCommand(`userList.refresh`, () => {
        // console.log(workspace!.workspaceFolders![0].uri.fsPath, 'refresh to git');
        // 刷新数据列表
        vscode_1.window.createTreeView('gitcode-userlist', {
            treeDataProvider: new treeData_1.default(),
        });
    }), vscode_1.commands.registerCommand(`userList.item.search`, (user) => {
        let userName = user.label.split(' ')[0];
        // 打开一个快速选择列表
        vscode_1.window
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
        ], {
            title: 'Query date', // 标题
            placeHolder: 'Please select an option！', // 占位符文本
            canPickMany: false, // 是否可以多选
        })
            .then((res) => {
            if (!res)
                return;
            const { label } = res;
            // console.log(res, userName, dayjs().format(), 'userNameuserName'); // 这里就是上面数组中对应的对象信息
            if (label === 'Current month') {
                searchBySetDate(userName, dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD'));
            }
            else if (label === 'Last month') {
                searchBySetDate(userName, dayjs().add(-1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().add(-1, 'month').endOf('month').format('YYYY-MM-DD'));
            }
            else if (label === 'Past six months') {
                searchByCustomDate(userName, dayjs().add(-5, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD'));
            }
            else {
                // 自定义日期
                searchByCustomDate(userName);
            }
        });
    }));
}
exports.activate = activate;
// 追踪当前 webview 面板
let currentPanel = undefined;
function createCurrentPanel() {
    // 获取当前活动的编辑器
    const columnToShowIn = vscode_1.window.activeTextEditor
        ? vscode_1.window.activeTextEditor.viewColumn
        : undefined;
    if (currentPanel) {
        // 如果我们已经有了一个面板，那就把它显示到目标列布局中
        // currentPanel.reveal(columnToShowIn);
        // 当前面板被关闭后重置
        // 先进行销毁
        currentPanel.dispose();
        /* 新创建一个页面，用了存放生成的数据 */
        currentPanel = vscode_1.window.createWebviewPanel('git-code-statistic', // 只供内部使用，这个 webview 的标识
        'git code statistic', // 给用户显示的面板标题
        vscode_1.ViewColumn.One, // 给新的 webview 面板一个编辑器视图
        {
            enableScripts: true, // 启用 javascript 脚本
            retainContextWhenHidden: true, // 隐藏时保留上下文
        } // webview 面板的内容配置
        );
    }
    else {
        /* 新创建一个页面，用了存放生成的数据 */
        currentPanel = vscode_1.window.createWebviewPanel('git-code-statistic', // 只供内部使用，这个 webview 的标识
        'git code statistic', // 给用户显示的面板标题
        vscode_1.ViewColumn.Active, // 给新的 webview 面板一个编辑器视图
        {
            enableScripts: true, // 启用 javascript 脚本
            retainContextWhenHidden: true, // 隐藏时保留上下文
        } // webview 面板的内容配置
        );
    }
}
function searchByCustomDate(userName, since, until) {
    // 创建当前面板
    createCurrentPanel();
    // 查询最近6个月的数据
    if (since && until) {
        git.logAcrossMonths(userName, since, until).then((result) => {
            currentPanel.webview.html = setMoreMonthPanelHtml(userName, since, until, result);
        });
    }
    else {
        // 从用户输入的时间查询, 如2020-01-31或2020/01/31
        getSelectedTextOrPrompt('输入开始时间,如2020-01-31或2020/01/31').then(function (since) {
            if (!since) {
                return;
            }
            else {
                getSelectedTextOrPrompt('输入结束时间，如2080-01-31或2080/01/31').then(function (until) {
                    if (!until) {
                        return;
                    }
                    // 判断间隔月份，是否大于2个月
                    if (dayjs(until).diff(dayjs(since), 'month') < 1) {
                        // 只是在一个月的范围
                        git
                            .logMonth({
                            author: userName,
                            since: since,
                            until: until,
                        })
                            .then((result) => {
                            currentPanel.webview.html = setPanelHtml(userName, since, until, result);
                        });
                    }
                    else {
                        // 多月的范围
                        git
                            .logAcrossMonths(userName, since, until)
                            .then((result) => {
                            console.log(result, 'result');
                            currentPanel.webview.html = setMoreMonthPanelHtml(userName, since, until, result);
                        });
                    }
                });
            }
        });
    }
}
// 查询指定单月的数据
function searchBySetDate(userName, since, until) {
    createCurrentPanel();
    git
        .logMonth({
        author: userName,
        since: since,
        until: until,
    })
        .then((result) => {
        currentPanel.webview.html = setPanelHtml(userName, since, until, result);
    });
}
// 设置单月的显示数据
const setPanelHtml = (userName, since, until, result) => {
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
        <div style='font-size: 18px;'>${result}</div>
      </body>
    </html>
  `;
};
// 设置多个月的显示数据
const setMoreMonthPanelHtml = (userName, since, until, result) => {
    let labelsArr = [];
    let dataArr = [];
    result.forEach((item) => {
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
function getSelectedTextOrPrompt(prompt) {
    return new Promise((resolve, reject) => {
        const activeTextEditor = vscode_1.window.activeTextEditor;
        if (activeTextEditor) {
            const selection = activeTextEditor.selection, start = selection.start, end = selection.end;
            console.log(activeTextEditor, 'selection');
            if (start.line !== end.line || start.character !== end.character) {
                return resolve(activeTextEditor.document.getText(selection));
            }
        }
        return resolve(vscode_1.window.showInputBox({ prompt }));
    });
}
function getWebViewContent(context, templatePath, panel) {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let htmlIndexPath = fs.readFileSync(resourcePath, 'utf-8');
    const html = htmlIndexPath.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        const absLocalPath = path.resolve(dirPath, $2);
        const webviewUri = panel.webview.asWebviewUri(vscode_1.Uri.file(absLocalPath));
        const replaceHref = $1 + webviewUri.toString() + '"';
        return replaceHref;
    });
    return html;
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitTools = void 0;
const child_process_1 = __webpack_require__(3);
const dayjs = __webpack_require__(5);
class GitTools {
    constructor(cwd) {
        this.cwd = cwd;
        this.user = '';
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.startChildProcess('git', ['remote', '-v'])
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                this.user = yield this.startChildProcess('git', [
                    'config',
                    'user.name',
                ]);
                console.log(this.user, 'username');
            }))
                .catch((err) => {
                console.error('git no remote', err);
            });
        });
    }
    remote() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var params = ['remote', '-v'];
                let result = yield this.startChildProcess('git', params);
                return result;
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    logMonth(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
            // 根据日期，作者，统计代码的提交行数
            const res = yield this.startChildProcessNoParams(`git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until}`);
            let resArr = [];
            res.split('\n').forEach((item) => {
                item && resArr.push(item.split('\t'));
            });
            if (resArr.length === 0) {
                return 'No submitted data！';
            }
            // 处理添加行数据
            let addLineNum = resArr.reduce((pre, current) => {
                return ((isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
                    (isNaN(parseInt(current[0])) ? 0 : parseInt(current[0])));
            }, 0);
            // 处理删除行数据
            let delLineNum = resArr.reduce((pre, current) => {
                return ((isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
                    (isNaN(parseInt(current[1])) ? 0 : parseInt(current[1])));
            }, 0);
            return `add line: ${addLineNum} remove line: ${delLineNum} total edit line: ${addLineNum + delLineNum}`;
        });
    }
    // 跨越多个月份
    logAcrossMonths(userName, since, until) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultArr = [];
            let monthArr = [];
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
            if (monthArr[monthArr.length - 1].label !== dayjs(until).format('YYYY-MM')) {
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
            const promiseAll = yield Promise.all(monthArr.map((item) => __awaiter(this, void 0, void 0, function* () {
                let res = yield this.startChildProcessNoParams(`git log --author="${userName}" --pretty=tformat: --numstat --since=${item.start} --until=${item.end}`);
                if (res.length === '') {
                    resultArr.push({
                        date: item.label,
                        value: null,
                    });
                }
                let resArr = [];
                res.split('\n').forEach((item) => {
                    item && resArr.push(item.split('\t'));
                });
                // 处理添加行数据
                let addLineNum = resArr.reduce((pre, current) => {
                    return ((isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
                        (isNaN(parseInt(current[0])) ? 0 : parseInt(current[0])));
                }, 0);
                // 处理删除行数据
                let delLineNum = resArr.reduce((pre, current) => {
                    return ((isNaN(parseInt(pre)) ? 0 : parseInt(pre)) +
                        (isNaN(parseInt(current[1])) ? 0 : parseInt(current[1])));
                }, 0);
                resultArr.push({
                    date: item.label,
                    value: addLineNum + delLineNum,
                });
                return resultArr;
            })));
            // 查询代码量
            // let returnVal = resultArr.filter((item) => Boolean(item.value));
            // resolve(returnVal)
            return promiseAll[0].filter((item) => Boolean(item.value));
        });
    }
    testAwk1(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // const res = await this.startChildProcess('echo', ['-e', 'A line1\nB line 2', '|', 'awk', 'BEGIN{ print "Start" } { print } END{ print "End" }']);
            const res = yield this.startChildProcessNoParams(`git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "add line: "add " remove line: "subs " all line: all "all }'`);
            return res;
            // return "testAwk";
            // 测试awk命令的执行
            // echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'
            // return execPromisify(`echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'`, { cwd: this.cwd });
        });
    }
    branch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var params = ['branch', '-a'];
                let result = yield this.startChildProcess('git', params);
                return result.toString();
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    }
    allUser() {
        return __awaiter(this, void 0, void 0, function* () {
            // git log --pretty=format:"%an <%ae>"| sort -u
            try {
                const res = yield this.startChildProcessNoParams(`git log --pretty=format:"%an <%ae>"| sort -u`);
                let resArr = res.split('\n');
                let resSet = new Set();
                resArr.forEach((item) => {
                    item && resSet.add(item);
                });
                return [...resSet]
                    .sort((a, b) => {
                    return a[0] > b[0] ? 1 : -1;
                })
                    .join('\n');
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var params = ['status', '-s'];
                let result = yield this.startChildProcess('git', params);
                return result;
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    }
    startChildProcess(command, params) {
        return new Promise((resolve, reject) => {
            var process = (0, child_process_1.spawn)(command, params, {
                cwd: this.cwd,
                shell: true,
            });
            var logMessage = `${command} ${params[0]}`;
            var cmdMessage = '';
            process.stdout.on('data', (data) => {
                console.log(`${logMessage} start ---`, data);
                if (!data) {
                    reject(`${logMessage} error1 : ${data}`);
                }
                else {
                    cmdMessage = data.toString();
                }
            });
            process.on('close', (data) => {
                console.log(`${logMessage} close ---`, data);
                if (data) {
                    reject(`${logMessage} error2 ! ${data}`);
                }
                else {
                    console.log(`${logMessage} success !`);
                    resolve(cmdMessage);
                }
            });
        });
    }
    startChildProcessNoParams(command) {
        return new Promise((resolve, reject) => {
            var process = (0, child_process_1.spawnSync)(command, {
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
exports.GitTools = GitTools;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const gitTools_1 = __webpack_require__(2);
// 创建一个类 TreeProvider，实现了 TreeDataProvider 接口
class TreeProvider {
    constructor() {
        // 创建一个事件发射器，用于通知树数据发生变化
        this._onDidChangeTreeData = new vscode.EventEmitter();
        // 定义一个只读的事件，允许外部订阅树数据变化事件
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    // 定义刷新方法，用于通知视图数据发生变化
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    // 获取树中的单个项目，这里可以定义如何显示单个项目
    getTreeItem(element) {
        return element;
    }
    // 获取树的子元素，可以是一个异步操作
    getChildren(element) {
        // 在这里实现获取树的子元素的逻辑
        // 可以返回一个 Promise 来异步获取子元素
        // 如果没有子元素，可以返回一个空数组
        // 在实际使用中，你需要根据你的插件逻辑来实现这个方法
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const gitTool = new gitTools_1.GitTools(vscode.workspace.workspaceFolders[0].uri.fsPath);
            const userList = yield gitTool.allUser();
            const result = userList.split("\n").filter(Boolean).map((item) => {
                return new vscode.TreeItem(item, vscode.TreeItemCollapsibleState.None);
            });
            resolve(result);
            // if (!element) {
            //   resolve([
            //     new vscode.TreeItem(
            //       'Hello World!',
            //       vscode.TreeItemCollapsibleState.Expanded
            //     ),
            //   ]);
            // } else {
            //   resolve([
            //     new vscode.TreeItem(
            //       'happy coding',
            //       vscode.TreeItemCollapsibleState.None
            //     ),
            //   ]);
            // }
        }));
    }
}
exports.default = TreeProvider;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():undefined}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return b},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return b.s(e.$y,4,"0");case"M":return a+1;case"MM":return b.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return b.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return b.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return b.s(u,2,"0");case"s":return String(e.$s);case"ss":return b.s(e.$s,2,"0");case"SSS":return b.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),k=_.prototype;return O.prototype=k,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=!0),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O}));

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map