import * as vscode from 'vscode';


const OPTION1 = `Replace with single quotes ('...',)`;
const OPTION2 = `Replace with double quotes ("...",)`;
const OPTION3 = 'Concat text with ~~';
const OPTION4 = 'Concat text with ,';
// const OPTION5 = 'Concat text with character';
const options = [OPTION1, OPTION2, OPTION3, OPTION4];

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.replaceText', async () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			// Opción para reemplazo en principio y fin de línea
			const replaceMode = await vscode.window.showQuickPick(
				options,
				{
					placeHolder: 'Choose the replace method'
				}
			);

			try {
				let regex: RegExp = new RegExp(`^(.+)$`, 'gm');

				let replaceText = '';
				switch (replaceMode) {
					case OPTION1:
						replaceText = "'$1',";
						break;
					case OPTION2:
						replaceText = `"$1",`;
						break;
					case OPTION3:
						regex = new RegExp(`\n+`, 'gm'); // Start of line 
						replaceText = '~~';
						break;
					case OPTION4:
						regex = new RegExp(`\n+`, 'gm'); // Start of line 
						replaceText = ',';
						break;
					default:
						replaceText = "'$1',";
						break;
				}


				const replacedText = selectedText.replace(regex, replaceText);

				editor.edit(editBuilder => {
					editBuilder.replace(selection, replacedText);
				});
			} catch (error: any) {
				vscode.window.showErrorMessage(`Error applying replace: ${error.message}. Verify the regext expresion is valid.`);
			}
		}
	});

	context.subscriptions.push(disposable);
}


export function deactivate() { }
