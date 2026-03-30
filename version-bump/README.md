# Version Bump GitHub Action

This GitHub Action calculates the next version of your project based on existing Git tags and a specified bump type. It
supports semantic versioning (`major`, `minor`, `patch`), build metadata, and calendar versioning (`calver`,
`calver-milestone`). The action also outputs the calculated version for use in subsequent workflow steps.

## Features

- Retrieves all Git tags from the repository.
- Supports multiple bump types: `major`, `minor`, `patch`, `build`, `milestone`, `calver`, `calver-milestone`.
- Customizable tag prefix (e.g., `v` for `v1.0.0`).
- Optional use of GitHub API for tag retrieval with a provided token.
- Outputs the next version for use in workflows.

## Usage

Add this action to your GitHub workflow by referencing it in your workflow YAML file. The action requires Node.js 20.

### Example Workflow

```yaml
name: Version Bump Workflow
on:
  push:
    branches:
      - main

jobs:
  version-bump:
    runs-on: ubuntu-latest
    steps:
      - name: Run Version Bump Action
        uses: gatling/private-actions@version-bump/v1
        id: version-bump
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          prefix: 'v'
          repo: ${{ github.repository }}
          bump: 'patch'

      - name: Print Next Version
        run: echo "The next version is ${{ steps.version-bump.outputs.next-version }}"
```

## Inputs

| Name           | Description                                                                               | Required | Default                    |
|----------------|-------------------------------------------------------------------------------------------|----------|----------------------------|
| `github-token` | GitHub token for accessing the API (optional, defaults to `GITHUB_TOKEN`).                | No       | `${{ github.token }}`      |
| `prefix`       | Prefix for version tags (e.g., `v` for `v1.0.0`).                                         | No       | `v`                        |
| `repo`         | GitHub repository in `owner/repo` format (defaults to current repository).                | No       | `${{ github.repository }}` |
| `bump`         | Bump type: `major`, `minor`, `patch`, `build`, `milestone`, `calver`, `calver-milestone`. | No       | `patch`                    |

## Outputs

| Name           | Description                                                                     |
|----------------|---------------------------------------------------------------------------------|
| `next-version` | The calculated next version (e.g., `v1.0.1`, `2025.30`, `v1.0.0+202507260007`). |

## Bump Types

- **major**: Increments the major version (e.g., `v1.2.3` → `v2.0.0`).
- **minor**: Increments the minor version (e.g., `v1.2.3` → `v1.3.0`).
- **patch**: Increments the patch version (e.g., `v1.2.3` → `v1.2.4`).
- **build**: Adds build metadata with a timestamp (e.g., `v1.2.3` → `v1.2.3+202507260007`).
- **milestone**: Increments a milestone suffix (e.g., `v1.2.3-m1` → `v1.2.3-m2`).
- **calver**: Uses calendar versioning with year and week (e.g., `2025.30`).
- **calver-milestone**: Uses calendar versioning with a micro version (e.g., `2025.30.0`).

## Prerequisites

- Node.js 20 or higher.
- TypeScript for compiling the action.
