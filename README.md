# Python Package Creator

**Create Python packages directly from the VS Code Explorer.**

Turn a path like `app.services.auth` into a package structure ready for your code, with an `__init__.py` file at every level. One command handles the folders and files for you.

![VS Code 1.100.0+](https://img.shields.io/badge/VS_Code-1.100.0%2B-007ACC)
![TypeScript](https://img.shields.io/badge/built_with-TypeScript-3178C6)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](#license)

## In action

Right-click the destination folder, select **Create Python Package**, and enter:

```text
app.services.auth
```

The extension creates this structure inside the selected folder:

```text
selected-folder/
└── app/
    ├── __init__.py
    └── services/
        ├── __init__.py
        └── auth/
            └── __init__.py
```

New `__init__.py` files are empty. If one already exists, its contents are preserved.

## Features

- **Nested packages in one step:** enter the entire hierarchy at once.
- **Three supported separators:** use dots, forward slashes, or backslashes.
- **Explorer integration:** create packages inside the folder you right-click.
- **Command Palette access:** run **Create Python Package** without opening a context menu.
- **Validation as you type:** get feedback when a segment does not match the accepted format.
- **Reuse existing structures:** complete the hierarchy with any missing folders and `__init__.py` files.
- **No extra setup:** creating files requires neither a Python interpreter nor the Python extension.

## Installation

Requires **VS Code 1.100.0 or later**.

### From a VSIX file

If you have a `.vsix` file for this extension:

1. Open the **Extensions** view in VS Code.
2. From the **…** menu, select **Install from VSIX…**.
3. Select the extension file.

To run the extension from source, see [Development](#development).

## Usage

### From the Explorer

1. Open a folder or workspace in VS Code.
2. Right-click a **folder** in the Explorer.
3. Select **Create Python Package**.
4. Enter a package name or path, such as `domain.models`.
5. Press **Enter**. A notification confirms that the package was created.

### From the Command Palette

1. Open the Command Palette with `Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS.
2. Search for **Create Python Package**.
3. Enter the package path and press **Enter**.

> When invoked from the Command Palette, the extension uses the first workspace folder as the destination, including in multi-root workspaces. To choose a different destination, use the Explorer context menu.

Press **Esc** in the input box to cancel before any files are created.

## Path examples

| Input | Resulting structure |
| --- | --- |
| `models` | `models/` |
| `app.services.auth` | `app/services/auth/` |
| `app/services/auth` | `app/services/auth/` |
| `app\services\auth` | `app/services/auth/` |
| `_internal.v2` | `_internal/v2/` |

Each level in the path receives its own `__init__.py` if one does not already exist. The destination folder itself does not automatically receive this file.

### Naming rules

Each segment must start with a letter from `A` to `Z`, from `a` to `z`, or with `_`. Subsequent characters may also include digits.

- Accepted: `models`, `_utils`, `api_v2`.
- Rejected: `2models`, `my-package`, `my package`, `módulos`.

Leading and trailing whitespace is removed from each segment. Empty segments are ignored: `app..models` produces the same structure as `app.models`.

> Validation checks the name format but does not reject Python keywords such as `class` and `for`. Avoid using them as package names.

## Scope and behavior

The extension creates directories and `__init__.py` files. It does not generate `pyproject.toml`, `setup.py`, virtual environments, or dependencies, and it does not publish packages to PyPI.

There are no extension-specific settings. The available command is:

| Command | Identifier |
| --- | --- |
| Create Python Package | `pythonPackageCreator.createPackage` |

If creation fails, the extension displays an error message with the reason. Folders and files created before the error are not automatically removed.

## Troubleshooting

| Issue | What to check |
| --- | --- |
| The command is missing from the context menu | Right-click a folder in the Explorer; the option is not shown for files. |
| The extension asks you to open a folder/workspace | Open a folder in VS Code before running the command from the Command Palette. |
| A package name is rejected | Check the naming rules and remove hyphens, internal spaces, or accented characters. |
| The package was created in a different folder | The Command Palette uses the first workspace folder. Use the Explorer to choose the destination. |
| Package creation failed | Check the error message, write permissions at the destination, and whether an existing file occupies the path of a folder to be created. |

## Development

The project uses **TypeScript**, the **VS Code** extension API, and **pnpm** for dependency management. Install Node.js and pnpm versions compatible with the tools declared in `package.json`.

### Run locally

1. Open the repository root in VS Code.
2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Press **F5** with the **Run Extension** configuration selected. The development task compiles the project in watch mode and launches an **Extension Development Host** window.
4. Open a folder in that window and try **Create Python Package**.

### Available commands

| Command | Purpose |
| --- | --- |
| `pnpm run compile` | Compile TypeScript into `out/`. |
| `pnpm run watch` | Recompile automatically during development. |
| `pnpm run lint` | Check the code in `src/` with ESLint. |
| `pnpm test` | Run compilation and linting through `pretest`, then launch the tests in VS Code. |

The current test suite contains only a sample test; it does not yet cover package creation. When changing this flow, also verify nested packages, all three separators, invalid names, and preservation of an existing `__init__.py` file.

### Project structure

```text
python-package-creator/
├── src/
│   ├── extension.ts          # Command, validation, and package creation
│   └── test/
│       └── extension.test.ts # Test suite
├── .vscode/                 # Tasks and debugging configuration
├── package.json             # Extension manifest and scripts
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # Lint rules
└── LICENSE                  # MIT license
```

## Contributing

Improvements, fixes, and tests are welcome. When reporting a problem, include your VS Code version, the package path you entered, how you invoked the command, and any error message.

Before proposing a change, run `pnpm run compile` and `pnpm run lint`, and verify the affected behavior in the Extension Development Host.

## License

Distributed under the MIT License. See the `LICENSE` file included with the extension for the full terms.

Developed by **Pedro Augusto Barbosa Aparecido**.
