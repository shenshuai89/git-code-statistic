module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e){t.exports=require("vscode")},function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{u(r.next(t))}catch(t){s(t)}}function a(t){try{u(r.throw(t))}catch(t){s(t)}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}u((r=r.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.GitTools=void 0;const i=n(4),s=n(2);e.GitTools=class{constructor(t){this.cwd=t,this.user="",this.init()}init(){return r(this,void 0,void 0,(function*(){this.startChildProcess("git",["remote","-v"]).then(t=>r(this,void 0,void 0,(function*(){this.user=yield this.startChildProcess("git",["config","user.name"]),console.log(this.user,"username")}))).catch(t=>{console.error("git no remote",t)})}))}remote(){return r(this,void 0,void 0,(function*(){try{return yield this.startChildProcess("git",["remote","-v"])}catch(t){console.error(t)}}))}logMonth(t){return r(this,void 0,void 0,(function*(){const e=yield this.startChildProcessNoParams(`git log --author="${t.author}" --pretty=tformat: --numstat --since=${t.since} --until=${t.until}`);let n=[];if(e.split("\n").forEach(t=>{t&&n.push(t.split("\t"))}),0===n.length)return"No submitted data！";let r=n.reduce((t,e)=>(isNaN(parseInt(t))?0:parseInt(t))+(isNaN(parseInt(e[0]))?0:parseInt(e[0])),0),i=n.reduce((t,e)=>(isNaN(parseInt(t))?0:parseInt(t))+(isNaN(parseInt(e[1]))?0:parseInt(e[1])),0);return`add line: ${r} remove line: ${i} total edit line: ${r+i}`}))}logAcrossMonths(t,e,n){return r(this,void 0,void 0,(function*(){let i=[],o=[];o.push({label:s(e).format("YYYY-MM"),start:e,end:s(e).endOf("month").format("YYYY-MM-DD")});let a=s(n).diff(e,"month");for(let t=1;t<=a;t++)o.push({label:s(e).add(t,"month").format("YYYY-MM"),start:s(e).add(t,"month").startOf("month").format("YYYY-MM-DD"),end:s(e).add(t,"month").endOf("month").format("YYYY-MM-DD")});o[o.length-1].label!==s(n).format("YYYY-MM")&&o.push({label:s(n).format("YYYY-MM"),start:s(n).startOf("month").format("YYYY-MM-DD"),end:n});return(yield Promise.all(o.map(e=>r(this,void 0,void 0,(function*(){let n=yield this.startChildProcessNoParams(`git log --author="${t}" --pretty=tformat: --numstat --since=${e.start} --until=${e.end}`);""===n.length&&i.push({date:e.label,value:null});let r=[];n.split("\n").forEach(t=>{t&&r.push(t.split("\t"))});let s=r.reduce((t,e)=>(isNaN(parseInt(t))?0:parseInt(t))+(isNaN(parseInt(e[0]))?0:parseInt(e[0])),0),o=r.reduce((t,e)=>(isNaN(parseInt(t))?0:parseInt(t))+(isNaN(parseInt(e[1]))?0:parseInt(e[1])),0);return i.push({date:e.label,value:s+o}),i})))))[0].filter(t=>Boolean(t.value))}))}testAwk1(t){return r(this,void 0,void 0,(function*(){return yield this.startChildProcessNoParams(`git log --author="${t.author}" --pretty=tformat: --numstat --since=${t.since} --until=${t.until} | awk 'BEGIN{ print "Start" } { add += $1; subs += $2; all += $1 + $2 } END{ print "add line: "add " remove line: "subs " all line: all "all }'`)}))}branch(){return r(this,void 0,void 0,(function*(){try{return(yield this.startChildProcess("git",["branch","-a"])).toString()}catch(t){console.error(t)}return!1}))}allUser(){return r(this,void 0,void 0,(function*(){try{let t=(yield this.startChildProcessNoParams('git log --pretty=format:"%an <%ae>"| sort -u')).split("\n"),e=new Set;return t.forEach(t=>{t&&e.add(t)}),[...e].sort((t,e)=>t[0]>e[0]?1:-1).join("\n")}catch(t){console.error(t)}return!1}))}status(){return r(this,void 0,void 0,(function*(){try{return yield this.startChildProcess("git",["status","-s"])}catch(t){console.error(t)}return!1}))}startChildProcess(t,e){return new Promise((n,r)=>{var s=(0,i.spawn)(t,e,{cwd:this.cwd,shell:!0}),o=`${t} ${e[0]}`,a="";s.stdout.on("data",t=>{console.log(o+" start ---",t),t?a=t.toString():r(`${o} error1 : ${t}`)}),s.on("close",t=>{console.log(o+" close ---",t),t?r(`${o} error2 ! ${t}`):(console.log(o+" success !"),n(a))})})}startChildProcessNoParams(t){return new Promise((e,n)=>{var r=(0,i.spawnSync)(t,{cwd:this.cwd,shell:!0,encoding:"utf8"});r.error&&(console.log("ERROR: ",r.error),n(r.error)),e(r.stdout)})}}},function(t,e,n){t.exports=function(){"use strict";var t=6e4,e=36e5,n="millisecond",r="second",i="minute",s="hour",o="day",a="week",u="month",c="quarter",l="year",d="date",h="Invalid Date",f=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,m=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,p={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},v=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},$={s:v,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+v(r,2,"0")+":"+v(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,u),s=n-i<0,o=e.clone().add(r+(s?-1:1),u);return+(-(r+(n-i)/(s?i-o:o-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:u,y:l,w:a,d:o,D:d,h:s,m:i,s:r,ms:n,Q:c}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},w="en",y={};y[w]=p;var g="$isDayjsObject",b=function(t){return t instanceof S||!(!t||!t[g])},M=function t(e,n,r){var i;if(!e)return w;if("string"==typeof e){var s=e.toLowerCase();y[s]&&(i=s),n&&(y[s]=n,i=s);var o=e.split("-");if(!i&&o.length>1)return t(o[0])}else{var a=e.name;y[a]=e,i=a}return!r&&i&&(w=i),i||!r&&w},D=function(t,e){if(b(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new S(n)},Y=$;Y.l=M,Y.i=b,Y.w=function(t,e){return D(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function p(t){this.$L=M(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[g]=!0}var v=p.prototype;return v.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(Y.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(f);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},v.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},v.$utils=function(){return Y},v.isValid=function(){return!(this.$d.toString()===h)},v.isSame=function(t,e){var n=D(t);return this.startOf(e)<=n&&n<=this.endOf(e)},v.isAfter=function(t,e){return D(t)<this.startOf(e)},v.isBefore=function(t,e){return this.endOf(e)<D(t)},v.$g=function(t,e,n){return Y.u(t)?this[e]:this.set(n,t)},v.unix=function(){return Math.floor(this.valueOf()/1e3)},v.valueOf=function(){return this.$d.getTime()},v.startOf=function(t,e){var n=this,c=!!Y.u(e)||e,h=Y.p(t),f=function(t,e){var r=Y.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return c?r:r.endOf(o)},m=function(t,e){return Y.w(n.toDate()[t].apply(n.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},p=this.$W,v=this.$M,$=this.$D,w="set"+(this.$u?"UTC":"");switch(h){case l:return c?f(1,0):f(31,11);case u:return c?f(1,v):f(0,v+1);case a:var y=this.$locale().weekStart||0,g=(p<y?p+7:p)-y;return f(c?$-g:$+(6-g),v);case o:case d:return m(w+"Hours",0);case s:return m(w+"Minutes",1);case i:return m(w+"Seconds",2);case r:return m(w+"Milliseconds",3);default:return this.clone()}},v.endOf=function(t){return this.startOf(t,!1)},v.$set=function(t,e){var a,c=Y.p(t),h="set"+(this.$u?"UTC":""),f=(a={},a[o]=h+"Date",a[d]=h+"Date",a[u]=h+"Month",a[l]=h+"FullYear",a[s]=h+"Hours",a[i]=h+"Minutes",a[r]=h+"Seconds",a[n]=h+"Milliseconds",a)[c],m=c===o?this.$D+(e-this.$W):e;if(c===u||c===l){var p=this.clone().set(d,1);p.$d[f](m),p.init(),this.$d=p.set(d,Math.min(this.$D,p.daysInMonth())).$d}else f&&this.$d[f](m);return this.init(),this},v.set=function(t,e){return this.clone().$set(t,e)},v.get=function(t){return this[Y.p(t)]()},v.add=function(n,c){var d,h=this;n=Number(n);var f=Y.p(c),m=function(t){var e=D(h);return Y.w(e.date(e.date()+Math.round(t*n)),h)};if(f===u)return this.set(u,this.$M+n);if(f===l)return this.set(l,this.$y+n);if(f===o)return m(1);if(f===a)return m(7);var p=(d={},d[i]=t,d[s]=e,d[r]=1e3,d)[f]||1,v=this.$d.getTime()+n*p;return Y.w(v,this)},v.subtract=function(t,e){return this.add(-1*t,e)},v.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=Y.z(this),s=this.$H,o=this.$m,a=this.$M,u=n.weekdays,c=n.months,l=n.meridiem,d=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},f=function(t){return Y.s(s%12||12,t,"0")},p=l||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(m,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return Y.s(e.$y,4,"0");case"M":return a+1;case"MM":return Y.s(a+1,2,"0");case"MMM":return d(n.monthsShort,a,c,3);case"MMMM":return d(c,a);case"D":return e.$D;case"DD":return Y.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return d(n.weekdaysMin,e.$W,u,2);case"ddd":return d(n.weekdaysShort,e.$W,u,3);case"dddd":return u[e.$W];case"H":return String(s);case"HH":return Y.s(s,2,"0");case"h":return f(1);case"hh":return f(2);case"a":return p(s,o,!0);case"A":return p(s,o,!1);case"m":return String(o);case"mm":return Y.s(o,2,"0");case"s":return String(e.$s);case"ss":return Y.s(e.$s,2,"0");case"SSS":return Y.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},v.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},v.diff=function(n,d,h){var f,m=this,p=Y.p(d),v=D(n),$=(v.utcOffset()-this.utcOffset())*t,w=this-v,y=function(){return Y.m(m,v)};switch(p){case l:f=y()/12;break;case u:f=y();break;case c:f=y()/3;break;case a:f=(w-$)/6048e5;break;case o:f=(w-$)/864e5;break;case s:f=w/e;break;case i:f=w/t;break;case r:f=w/1e3;break;default:f=w}return h?f:Y.a(f)},v.daysInMonth=function(){return this.endOf(u).$D},v.$locale=function(){return y[this.$L]},v.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=M(t,e,!0);return r&&(n.$L=r),n},v.clone=function(){return Y.w(this.$d,this)},v.toDate=function(){return new Date(this.valueOf())},v.toJSON=function(){return this.isValid()?this.toISOString():null},v.toISOString=function(){return this.$d.toISOString()},v.toString=function(){return this.$d.toUTCString()},p}(),O=S.prototype;return D.prototype=O,[["$ms",n],["$s",r],["$m",i],["$H",s],["$W",o],["$M",u],["$y",l],["$D",d]].forEach((function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),D.extend=function(t,e){return t.$i||(t(e,S,D),t.$i=!0),D},D.locale=M,D.isDayjs=b,D.unix=function(t){return D(1e3*t)},D.en=y[w],D.Ls=y,D.p={},D}()},function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{u(r.next(t))}catch(t){s(t)}}function a(t){try{u(r.throw(t))}catch(t){s(t)}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}u((r=r.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.deactivate=e.activate=void 0;const i=n(0),s=n(1),o=n(5),a=n(2),u=(n(6),n(7),new s.GitTools(i.workspace.workspaceFolders[0].uri.fsPath));e.activate=function(t){i.window.createTreeView("gitcode-userlist",{treeDataProvider:new o.default}),t.extensionPath;let e=i.commands.registerCommand("git-code-statistic.gitcode",(function(){return r(this,void 0,void 0,(function*(){p("输入作者").then((function(t){t&&d(t)}))}))}));t.subscriptions.push(e,i.commands.registerCommand("userList.refresh",()=>{i.window.createTreeView("gitcode-userlist",{treeDataProvider:new o.default})}),i.commands.registerCommand("userList.item.search",t=>{let e=t.label.split(" ")[0];i.window.showQuickPick([{label:"Current month",detail:"Submit code statistics current month"},{label:"Last month",detail:"Submit code statistics Last month"},{label:"Past six months",detail:"Submit code statistics Last six month"},{label:"Custom date query",detail:"setting custom query date "}],{title:"Query date",placeHolder:"Please select an option！",canPickMany:!1}).then(t=>{if(!t)return;const{label:n}=t;"Current month"===n?h(e,a().startOf("month").format("YYYY-MM-DD"),a().endOf("month").format("YYYY-MM-DD")):"Last month"===n?h(e,a().add(-1,"month").startOf("month").format("YYYY-MM-DD"),a().add(-1,"month").endOf("month").format("YYYY-MM-DD")):"Past six months"===n?d(e,a().add(-5,"month").startOf("month").format("YYYY-MM-DD"),a().endOf("month").format("YYYY-MM-DD")):d(e)})}))};let c=void 0;function l(){i.window.activeTextEditor&&i.window.activeTextEditor.viewColumn;c?(c.dispose(),c=i.window.createWebviewPanel("git-code-statistic","git code statistic",i.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0})):c=i.window.createWebviewPanel("git-code-statistic","git code statistic",i.ViewColumn.Active,{enableScripts:!0,retainContextWhenHidden:!0})}function d(t,e,n){l(),e&&n?u.logAcrossMonths(t,e,n).then(r=>{c.webview.html=m(t,e,n,r)}):p("输入开始时间,如2020-01-31或2020/01/31").then((function(e){e&&p("输入结束时间，如2080-01-31或2080/01/31").then((function(n){n&&(a(n).diff(a(e),"month")<1?u.logMonth({author:t,since:e,until:n}).then(r=>{c.webview.html=f(t,e,n,r)}):u.logAcrossMonths(t,e,n).then(r=>{console.log(r,"result"),c.webview.html=m(t,e,n,r)}))}))}))}function h(t,e,n){l(),u.logMonth({author:t,since:e,until:n}).then(r=>{c.webview.html=f(t,e,n,r)})}const f=(t,e,n,r)=>`<!DOCTYPE html>\n    <html lang="en">\n      <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <title>git code analysis</title>\n      </head>\n      <body>\n        <h3 id="myTitle">git code analysis</h3>\n        <p>The project submitted code line by <b>${t}</b> from <b>${e}</b> to <b>${n}</b> is as follows</p>\n        <div style='font-size: 18px;'>${r}</div>\n      </body>\n    </html>\n  `,m=(t,e,n,r)=>{let i=[],s=[];return r.forEach(t=>{i.push(t.date.replace("-","")),s.push(t.value)}),`<!DOCTYPE html>\n    <html lang="en">\n      <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <title>git code analysis</title>\n      </head>\n      <body>\n        ${r.length>0?'<canvas id="myGitChart" height="400" width="660"></canvas>':""}\n        <h3 id="myTitle">git code analysis</h3>\n        <p>The project submitted code line by <b>${t}</b> from <b>${e}</b> to <b>${n}</b> is ${r.length>0?"above chart.":"no submit code."} </p>\n        <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>\n        <script type="text/javascript">\n          let canvas = document.getElementById('myGitChart');\n          let myTitle = document.getElementById('myTitle');\n          new Chart(canvas, {\n            type: 'bar',\n            data: {\n              labels: [${i}],\n              datasets: [\n                {\n                  label: 'edit code line',\n                  data: [${s}],\n                  borderWidth: 1,\n                },\n              ],\n            },\n            options: {\n              scales: {\n                y: {\n                  beginAtZero: true,\n                },\n              },\n            },\n          });\n         \n        <\/script>\n      </body>\n    </html>\n  `};function p(t){return new Promise((e,n)=>{const r=i.window.activeTextEditor;if(r){const t=r.selection,n=t.start,i=t.end;if(console.log(r,"selection"),n.line!==i.line||n.character!==i.character)return e(r.document.getText(t))}return e(i.window.showInputBox({prompt:t}))})}e.deactivate=function(){}},function(t,e){t.exports=require("child_process")},function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(i,s){function o(t){try{u(r.next(t))}catch(t){s(t)}}function a(t){try{u(r.throw(t))}catch(t){s(t)}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}u((r=r.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0});const i=n(0),s=n(1);e.default=class{constructor(){this._onDidChangeTreeData=new i.EventEmitter,this.onDidChangeTreeData=this._onDidChangeTreeData.event}refresh(){this._onDidChangeTreeData.fire(void 0)}getTreeItem(t){return t}getChildren(t){return new Promise((t,e)=>r(this,void 0,void 0,(function*(){const e=new s.GitTools(i.workspace.workspaceFolders[0].uri.fsPath),n=(yield e.allUser()).split("\n").filter(Boolean).map(t=>new i.TreeItem(t,i.TreeItemCollapsibleState.None));t(n)})))}}},function(t,e){t.exports=require("path")},function(t,e){t.exports=require("fs")}]);
//# sourceMappingURL=extension.js.map