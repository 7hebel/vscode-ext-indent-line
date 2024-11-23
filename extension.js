const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('singlelineindent.indentLine', function () {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open editor
		}

		// Retrieve the current tab size and type
		const config = vscode.workspace.getConfiguration('editor', editor.document.uri);
		const tabSize = config.get('tabSize', 4);
		const insertSpaces = config.get('insertSpaces', true);

		const indentation = insertSpaces ? ' '.repeat(tabSize) : '\t';

		const { selections } = editor;
		editor.edit(editBuilder => {
			for (const selection of selections) {
				if (selection.isEmpty) {
					// No selection, move cursor with tab behavior
					const line = editor.document.lineAt(selection.start.line);
					editBuilder.insert(line.range.start, indentation);
				} else {
					// Indent each selected line
					for (let i = selection.start.line; i <= selection.end.line; i++) {
						const line = editor.document.lineAt(i);
						editBuilder.insert(line.range.start, indentation);
					}
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
