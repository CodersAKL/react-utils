import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import { run as convertToTypeScript } from 'react-js-to-ts';
import { ModuleKind, transpileModule } from 'typescript';
import { cjsToEsm } from '@wessberg/cjs-to-esm-transformer';

import { editorContext, showInputBox, camelCase, getNewFileName, isJsx } from './utils';

const { Position } = vscode;

export const activeEditor = () => vscode.window.activeTextEditor;

export async function extractStyle() {
    const editor = activeEditor();

    if (!editor) {
        return;
    }

    const input = await showInputBox(undefined, 'Enter style name');
    const styleName = camelCase(input || '');

    editorContext((editor, selection, text, selectedText) => {
        editor
            .edit((edit) => {
                const defaultLine = editor.document.lineCount + 1;
                let stylesText;
                let row = null;

                if (text && !!~text.indexOf('StyleSheet.create')) {
                    editor.document.getText(selection);
                    row = editor.document.positionAt(text.indexOf('StyleSheet.create')).line;
                    stylesText = `${styleName}: ${selectedText},\n`;
                } else {
                    stylesText = `\nconst styles = StyleSheet.create({\n${styleName}: ${selectedText},\n});`;
                }

                edit.replace(selection, `styles.${styleName}`);

                edit.insert(new Position(row ? row + 1 : defaultLine, 0), stylesText);
            })
            .then(() => {
                return vscode.commands.executeCommand('editor.action.formatDocument');
            });
    });
}

export const convertFileToTypescript = async (uri: vscode.Uri) => {
    const { path } = uri;

    vscode.workspace
        .openTextDocument(uri)
        .then(async (document) => {
            const text = document.getText();
            const newFile = getNewFileName(path, isJsx(text) ? 'tsx' : 'ts');

            await fs.rename(path, newFile);
            const result = convertToTypeScript(newFile);

            await fs.writeFile(newFile, result);
            const file = await vscode.workspace.openTextDocument(newFile);

            vscode.window.showTextDocument(file);
        })
        .then(() => {
            return vscode.commands.executeCommand('editor.action.formatDocument');
        });
};

export const convertCjsToEsm = async (uri: vscode.Uri) => {
    const { path } = uri;

    vscode.workspace
        .openTextDocument(uri)
        .then(async (document) => {
            const text = document.getText();
            const newFile = getNewFileName(path, isJsx(text) ? 'tsx' : 'ts');

            const result = transpileModule(text, {
                transformers: cjsToEsm(),
                compilerOptions: {
                    module: ModuleKind.ESNext,
                },
            });

            await fs.rename(path, newFile);
            await fs.writeFile(newFile, result.outputText);

            const file = await vscode.workspace.openTextDocument(newFile);

            vscode.window.showTextDocument(file);
        })
        .then(() => {
            return vscode.commands.executeCommand('editor.action.formatDocument');
        });
};
