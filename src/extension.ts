import * as vscode from 'vscode';

import { extractStyle, convertFileToTypescript, convertCjsToEsm } from './commands';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "react-toolkit" is now active!');

    const commandExtractStyle = vscode.commands.registerCommand('react-toolkit.extractStyle', extractStyle);
    const commandReadFile = vscode.commands.registerCommand('react-toolkit.convertToTS', convertFileToTypescript);
    const commandCjsToEsm = vscode.commands.registerCommand('react-toolkit.convertCjsToEsm', convertCjsToEsm);

    context.subscriptions.push(commandExtractStyle);
    context.subscriptions.push(commandReadFile);
    context.subscriptions.push(commandCjsToEsm);
}
