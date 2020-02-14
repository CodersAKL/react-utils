import * as vscode from 'vscode';
import { extractStyle, convertFileToTypescript } from './commands';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "react-toolkit" is now active!');

    const commandExtractStyle = vscode.commands.registerCommand('react-toolkit.extractStyle', extractStyle);
    const commandReadFile = vscode.commands.registerCommand('react-toolkit.readFile', convertFileToTypescript);

    context.subscriptions.push(commandExtractStyle);
    context.subscriptions.push(commandReadFile);
}

export function deactivate() {}
