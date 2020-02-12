import * as vscode from 'vscode';
import lineColumn from 'line-column';
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
                let row = undefined;

                if (text && !!~text.indexOf('StyleSheet.create')) {
                    row = lineColumn(text).fromIndex(text.indexOf('StyleSheet.create'));
                    stylesText = `${styleName}: ${selectedText},\n`;
                } else {
                    stylesText = `\n\nconst styles = StyleSheet.create({\n${styleName}: ${selectedText},\n})`;
                }

                edit.replace(selection, `styles.${styleName}`);

                edit.insert(new Position(row ? row.line : defaultLine, 0), stylesText);
            })
            .then(() => {
                return vscode.commands.executeCommand('editor.action.formatDocument');
            });
    });
}
