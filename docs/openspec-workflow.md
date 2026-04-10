# OpenSpec Workflow Notes

## What the CLI handles

- `openspec new change <name>` — scaffolds the change directory + `.openspec.yaml` + `README.md`
- `openspec list` — status across all changes
- `openspec instructions <artifact> --change <name>` — generates instructions/templates for each artifact
- `openspec validate` — lints artifacts
- `openspec archive` — applies delta specs to `openspec/specs/` and archives the change

## What we handle manually

The CLI does not create spec subdirectories inside a change. These must be created by hand:

```
openspec/changes/<name>/proposal.md
openspec/changes/<name>/design.md
openspec/changes/<name>/specs/<capability>/spec.md
openspec/changes/<name>/tasks.md
```

After writing the proposal and identifying capabilities, create each spec dir:

```bash
mkdir -p openspec/changes/<name>/specs/<capability>
```

The `openspec archive` command will pick them up and apply them to `openspec/specs/` automatically.

## Naming convention

Change directories use `v{major}-{minor}-{patch}-{brief}`, e.g. `v0-1-2-disabled-prop`.

- Must start with a letter (CLI constraint)
- Lowercase, hyphens only
- Version first for sorting

## Process order

1. `openspec new change <name>`
2. `openspec instructions proposal --change <name>` → write `proposal.md`
3. Identify capabilities from proposal → `mkdir -p specs/<capability>`
4. `openspec instructions specs --change <name>` → write `specs/<capability>/spec.md`
5. `openspec instructions design --change <name>` → write `design.md`
6. `openspec instructions tasks --change <name>` → write `tasks.md`
7. Implement, check off tasks
8. `pnpm release`
9. `openspec archive <name>`
