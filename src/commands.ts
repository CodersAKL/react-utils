import * as vscode from 'vscode';
import { editorContext, showInputBox, camelCase } from './utils';

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
