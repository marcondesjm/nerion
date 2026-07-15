---
name: instagram-auto-publisher
description: Build reusable Instagram feed automation for one or more accounts using configurable content packs, visual styles, GitHub Actions, Playwright carousel rendering, imgBB upload, Instagram Graph API publishing, dry-run/render-only previews, and PT-BR accent/mojibake validation. Use when Codex needs to create, clone, adapt, validate, or troubleshoot automatic Instagram carousel/feed posting for a brand, client, or additional Instagram account.
---

# Instagram Auto Publisher

Use this skill to create or adapt an automated Instagram feed/carousel publisher for a new account.

## Core Workflow

1. Copy the bundled template from `../../assets/instagram-template` into the target repo, normally as `automation/instagram-template` or `automation/instagram-<account>`.
2. Create or edit config files:
   - `config/accounts.json` from `config/accounts.example.json`
   - `config/content-packs.json` from `config/content-packs.example.json`
   - `config/visual-styles.json` from `config/visual-styles.example.json`
3. Configure one account object per Instagram:
   - `account`: stable CLI key, e.g. `cliente-x`
   - `expectedUsername`: Instagram username returned by Graph API
   - `brandName` and `footerText`: rendered on slides
   - `accessTokenEnv`, `userIdEnv`, `imgbbKeyEnv`: env/secret variable names
   - `scheduleUtc`: intended cron in UTC
4. Add content packs for the account. Each pack needs `slides[]` and `caption`.
5. Validate before publishing:
   - `node automation/instagram-template/scripts/publish-carousel.mjs --account <account> --validate-copy`
   - `node automation/instagram-template/scripts/publish-carousel.mjs --account <account> --render-only`
6. Only after visual review, wire GitHub Actions from `workflows/instagram-feed-template.yml`.
7. Start new accounts with `dry_run=true`. Publish live only after account identity and assets are confirmed.

## Safety Rules

- Never publish before `expectedUsername` matches the Graph API username.
- Never publish if `--validate-copy` fails.
- Treat mojibake markers such as `Ãƒ`, `Ã‚`, `Ã¢`, or `ï¿½` as blockers.
- Keep hashtags allowed without accents when they are intentional.
- For Brazilian Portuguese public copy, restore real accents in text and captions.
- Do not commit generated `runs/` output.

## Useful Commands

Validate copy:

```powershell
node automation\instagram-template\scripts\publish-carousel.mjs --account cliente-exemplo --validate-copy
```

Render preview without network publishing:

```powershell
node automation\instagram-template\scripts\publish-carousel.mjs --account cliente-exemplo --render-only
```

Dry-run against Instagram containers:

```powershell
node automation\instagram-template\scripts\publish-carousel.mjs --account cliente-exemplo --dry-run
```

Live publish:

```powershell
node automation\instagram-template\scripts\publish-carousel.mjs --account cliente-exemplo
```

## When Updating an Existing Automation

- Inspect the current script and workflow first; do not replace a working account-specific flow unless the user asks.
- Prefer extracting reusable config while preserving known secrets and expected usernames.
- Run `--validate-copy` and `--render-only` after changes.
- If publishing is requested, report account username, media ID, permalink, and whether the run was dry-run or live.
