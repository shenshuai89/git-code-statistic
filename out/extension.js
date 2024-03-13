module.exports=function(t){var e={};function o(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=t,o.c=e,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=2)}([function(t,e){t.exports=require("vscode")},function(t,e,o){"use strict";var r=this&&this.__awaiter||function(t,e,o,r){return new(o||(o=Promise))((function(n,i){function s(t){try{a(r.next(t))}catch(t){i(t)}}function c(t){try{a(r.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof o?e:new o((function(t){t(e)}))).then(s,c)}a((r=r.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.GitTools=void 0;const n=o(3);e.GitTools=class{constructor(t){this.cwd=t,this.user="",this.init()}init(){return r(this,void 0,void 0,(function*(){this.startChildProcess("git",["remote","-v"]).then(t=>r(this,void 0,void 0,(function*(){this.user=yield this.startChildProcess("git",["config","user.name"]),console.log(this.user,"username")}))).catch(t=>{console.error("git no remote",t)})}))}remote(){return r(this,void 0,void 0,(function*(){try{return yield this.startChildProcess("git",["remote","-v"])}catch(t){console.error(t)}}))}logMonth(t){return r(this,void 0,void 0,(function*(){return yield this.startChildProcessNoParams(`git log --author="${t.author}" --pretty=tformat: --numstat --since=${t.since} --until=${t.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`)}))}testAwk1(t){return r(this,void 0,void 0,(function*(){return yield this.startChildProcessNoParams(`git log --author="${t.author}" --pretty=tformat: --numstat --since=${t.since} --until=${t.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "添加行: add "add " 移除行: remove "subs " 总计行: all "all }'`)}))}branch(){return r(this,void 0,void 0,(function*(){try{return(yield this.startChildProcess("git",["branch","-a"])).toString()}catch(t){console.error(t)}return!1}))}allUser(){return r(this,void 0,void 0,(function*(){try{return yield this.startChildProcessNoParams('git log --pretty=format:"%an <%ae>"| sort -u')}catch(t){console.error(t)}return!1}))}status(){return r(this,void 0,void 0,(function*(){try{return yield this.startChildProcess("git",["status","-s"])}catch(t){console.error(t)}return!1}))}startChildProcess(t,e){return new Promise((o,r)=>{var i=(0,n.spawn)(t,e,{cwd:this.cwd,shell:!0}),s=`${t} ${e[0]}`,c="";i.stdout.on("data",t=>{console.log(s+" start ---",t),t?c=t.toString():r(`${s} error1 : ${t}`)}),i.on("close",t=>{console.log(s+" close ---",t),t?r(`${s} error2 ! ${t}`):(console.log(s+" success !"),o(c))})})}startChildProcessNoParams(t){return new Promise((e,o)=>{var r=(0,n.spawn)(t,{cwd:this.cwd,shell:!0}),i=""+t,s="";r.stdout.on("data",t=>{console.log(i+" start ---",t),t?s=t.toString():o(`${i} error1 : ${t}`)}),r.on("close",t=>{console.log(i+" close ---",t),t?o(`${i} error2 ! ${t}`):(console.log(i+" success !"),e(s))})})}}},function(t,e,o){"use strict";var r=this&&this.__awaiter||function(t,e,o,r){return new(o||(o=Promise))((function(n,i){function s(t){try{a(r.next(t))}catch(t){i(t)}}function c(t){try{a(r.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof o?e:new o((function(t){t(e)}))).then(s,c)}a((r=r.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.deactivate=e.activate=void 0;const n=o(0),i=o(1),s=o(4),c=new i.GitTools(n.workspace.workspaceFolders[0].uri.fsPath);function a(t){let e=void 0;u("输入开始时间,如2020-01-31或2020/01/31").then((function(o){o&&u("输入结束时间，如2080-01-31或2080/01/31").then((function(r){r&&c.logMonth({author:t,since:o,until:r}).then(t=>{const o=n.window.activeTextEditor?n.window.activeTextEditor.viewColumn:void 0;e?e.reveal(o):(e=n.window.createWebviewPanel("git-code-statistic","git code statistic",n.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),e.webview.html=t.slice(5),e.onDidDispose(()=>{e=void 0},null))})}))}))}function u(t){return new Promise((e,o)=>{const r=n.window.activeTextEditor;if(r){const t=r.selection,o=t.start,n=t.end;if(console.log(r,"selection"),o.line!==n.line||o.character!==n.character)return e(r.document.getText(t))}return e(n.window.showInputBox({prompt:t}))})}e.activate=function(t){n.window.createTreeView("gitcode-userlist",{treeDataProvider:new s.default});let e=n.commands.registerCommand("git-code-statistic.gitcode",(function(){return r(this,void 0,void 0,(function*(){u("输入作者").then((function(t){t&&a(t)}))}))}));t.subscriptions.push(e,n.commands.registerCommand("userList.add",()=>{console.log(n.workspace.workspaceFolders[0].uri.fsPath,"add to git")}),n.commands.registerCommand("userList.item.remove",t=>{let e=t.label.split(" ")[0];console.log(t,"remove removeremoveremove"),a(e)}))},e.deactivate=function(){}},function(t,e){t.exports=require("child_process")},function(t,e,o){"use strict";var r=this&&this.__awaiter||function(t,e,o,r){return new(o||(o=Promise))((function(n,i){function s(t){try{a(r.next(t))}catch(t){i(t)}}function c(t){try{a(r.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?n(t.value):(e=t.value,e instanceof o?e:new o((function(t){t(e)}))).then(s,c)}a((r=r.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const n=o(0),i=o(1);e.default=class{constructor(){this._onDidChangeTreeData=new n.EventEmitter,this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire(void 0)}getTreeItem(t){return t}getChildren(t){return new Promise((t,e)=>r(this,void 0,void 0,(function*(){const e=new i.GitTools(n.workspace.workspaceFolders[0].uri.fsPath),o=(yield e.allUser()).split("\n").filter(Boolean).map(t=>new n.TreeItem(t,n.TreeItemCollapsibleState.None));t(o)})))}}}]);
//# sourceMappingURL=extension.js.map