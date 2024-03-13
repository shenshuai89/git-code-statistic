import * as vscode from 'vscode';
import { GitTools } from './gitTools';

// 创建一个类 TreeProvider，实现了 TreeDataProvider 接口
export default class TreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  // 创建一个事件发射器，用于通知树数据发生变化
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined
  > = new vscode.EventEmitter<vscode.TreeItem | undefined>();
  // 定义一个只读的事件，允许外部订阅树数据变化事件
  readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> =
    this._onDidChangeTreeData.event;

  // 定义刷新方法，用于通知视图数据发生变化
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  // 获取树中的单个项目，这里可以定义如何显示单个项目
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  // 获取树的子元素，可以是一个异步操作
  getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    // 在这里实现获取树的子元素的逻辑
    // 可以返回一个 Promise 来异步获取子元素
    // 如果没有子元素，可以返回一个空数组
    // 在实际使用中，你需要根据你的插件逻辑来实现这个方法
    return new Promise(async (resolve, reject) => {
      const gitTool = new GitTools(vscode.workspace.workspaceFolders![0].uri.fsPath);
      const userList: string = await gitTool.allUser() as string;
      const result = userList.split("\n").filter(Boolean).map((item: string) => {
        return new vscode.TreeItem(item, vscode.TreeItemCollapsibleState.None)
      });
      resolve(result)
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
    });
  }
}
