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
const git = new gitTools_1.GitTools(vscode_1.workspace.workspaceFolders[0].uri.fsPath);
function activate(context) {
    vscode_1.window.createTreeView('gitcode-userlist', {
        treeDataProvider: new treeData_1.default(),
    });
    let disposable = vscode_1.commands.registerCommand('git-code-statistic.gitcode', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // const git = new GitTools(__dirname);
            // console.log(workspace.workspaceFolders[0].uri.fsPath, "pathpath to git")
            getSelectedTextOrPrompt('输入作者').then(function (author) {
                if (!author) {
                    return;
                }
                else {
                    searchByDate(author);
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
        });
    });
    context.subscriptions.push(disposable, vscode_1.commands.registerCommand(`userList.add`, () => {
        console.log(vscode_1.workspace.workspaceFolders[0].uri.fsPath, 'add to git');
    }), vscode_1.commands.registerCommand(`userList.item.remove`, (user) => {
        let userName = user.label.split(' ')[0];
        console.log(user, 'remove removeremoveremove');
        searchByDate(userName);
    }));
}
exports.activate = activate;
// 追踪当前 webview 面板
let currentPanel = undefined;
function searchByDate(userName) {
    getSelectedTextOrPrompt('输入开始时间,如2020-01-31或2020/01/31').then(function (since) {
        if (!since) {
            return;
        }
        else {
            getSelectedTextOrPrompt('输入结束时间，如2080-01-31或2080/01/31').then(function (until) {
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
                        currentPanel.webview.html = setPanelHtml(userName, since, until, result);
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
                        currentPanel.webview.html = setPanelHtml(userName, since, until, result);
                    }
                });
            });
        }
    });
}
const setPanelHtml = (userName, since, until, result) => {
    return `
    <html>
      <body>
        <h3>git code analysis</h3>
        <p>The project submitted code line by <b>${userName}</b> from <b>${since}</b> to <b>${until}</b> is as follows</p>
        <div style='font-size: 18px;'>${result.slice(5)}</div>
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
            const res = yield this.startChildProcessNoParams(`git log --author="${params.author}" --pretty=tformat: --numstat --since=${params.since} --until=${params.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "add line: "add " remove line: "subs " all line: "all }'`);
            return res;
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
                return res;
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
            var process = (0, child_process_1.spawn)(command, {
                cwd: this.cwd,
                shell: true,
            });
            var logMessage = `${command}`;
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


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map