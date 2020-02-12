import * as vscode from 'vscode';
import { extractStyle } from './commands';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "react-toolkit" is now active!');

    const disposable = vscode.commands.registerCommand('react-toolkit.extractStyle', extractStyle);

    context.subscriptions.push(disposable);
}

export function deactivate() {}
