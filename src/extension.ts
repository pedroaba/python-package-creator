import * as vscode from 'vscode';

class Utilities {
  static async resourceExists(
    uri: vscode.Uri,
  ): Promise<boolean> {
    try {
      await vscode.workspace.fs.stat(uri);

      return true;
    } catch {
      return false;
    }
  }

  static getBaseUri(
    uri?: vscode.Uri,
  ): vscode.Uri | undefined {
    if (uri) {
      return uri;
    }

    return vscode.workspace.workspaceFolders?.[0]?.uri;
  }

  static parsePackagePath(
    value: string,
  ): string[] {
    return value
      .trim()
      .replaceAll('\\', '.')
      .replaceAll('/', '.')
      .split('.')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  static validatePackagePath(
    value: string,
  ): string | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return 'Enter the package name.';
    }

    const packages =
      Utilities.parsePackagePath(trimmedValue);

    if (packages.length === 0) {
      return 'Enter a valid Python package.';
    }

    const pythonIdentifierRegex =
      /^[A-Za-z_][A-Za-z0-9_]*$/;

    for (const packageName of packages) {
      if (
        !pythonIdentifierRegex.test(packageName)
      ) {
        return `"${packageName}" is not a valid Python package name.`;
      }
    }

    return undefined;
  }
}

export function activate(
  context: vscode.ExtensionContext,
) {
  console.log(
    'Python Package Creator extension activated.',
  );

  const disposable =
    vscode.commands.registerCommand(
      'pythonPackageCreator.createPackage',

      async (clickedUri?: vscode.Uri) => {
        try {
          const baseUri =
            Utilities.getBaseUri(clickedUri);

          if (!baseUri) {
            vscode.window.showErrorMessage(
              'Open a folder/workspace before creating a Python package.',
            );

            return;
          }

          const packagePath =
            await vscode.window.showInputBox({
              title: 'Create Python Package',
              prompt:
                'Enter the path to the Python package.',
              placeHolder:
                'src.models.settings',
              ignoreFocusOut: true,
              validateInput:
                Utilities.validatePackagePath,
            });

          if (!packagePath) {
            return;
          }

          const packageNames =
            Utilities.parsePackagePath(
              packagePath,
            );

          let currentUri = baseUri;

          for (
            const packageName of packageNames
          ) {
            currentUri = vscode.Uri.joinPath(
              currentUri,
              packageName,
            );

            await vscode.workspace.fs.createDirectory(
              currentUri,
            );

            const initFileUri =
              vscode.Uri.joinPath(
                currentUri,
                '__init__.py',
              );

            if (
              !(await Utilities.resourceExists(
                initFileUri,
              ))
            ) {
              await vscode.workspace.fs.writeFile(
                initFileUri,
                Buffer.from('', 'utf8'),
              );
            }
          }

          vscode.window.showInformationMessage(
            `Python package "${packageNames.join('.')}" created successfully.`,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Unknown error.';

          vscode.window.showErrorMessage(
            `Could not create the Python package: ${message}`,
          );
        }
      },
    );

  context.subscriptions.push(disposable);
}

export function deactivate() {}