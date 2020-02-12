import * as vscode from 'vscode';
import { InputBoxOptions } from 'vscode';

export const editorContext = (
    callback: (editor: vscode.TextEditor, selection: vscode.Selection, original: string, text: string) => any,
) => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const selection = editor.selection;
        const original = editor.document.getText();
        const text = editor.document.getText(selection);

        return callback(editor, selection, original, text);
    }
};

export const showInputBox = (defaultValue: InputBoxOptions['value'], placeHolder: InputBoxOptions['placeHolder']) =>
    vscode.window.showInputBox({
        value: defaultValue,
        placeHolder,
    });

export const camelCase = (string: string) =>
    string
        .toLowerCase()
        .trim()
        .split(/[.\-_\s]/g)
        .reduce((string, word) => string + word[0].toUpperCase() + word.slice(1));
