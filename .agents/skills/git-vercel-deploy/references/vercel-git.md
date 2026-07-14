# Vercel and Git Deployment Reference

Use this reference only when more detail is needed than the main skill workflow.

## Preferred Deployment Paths

### Git Integration

Use this path when the repo is already connected to Vercel:

1. Commit locally.
2. Push to the connected branch.
3. Vercel deploys automatically.
4. Verify through Vercel dashboard or deployment notifications.

This is safest for normal production workflows because Vercel keeps environment variables and project settings in the Vercel account.

### Vercel CLI

Use this path when the user wants Codex to trigger a deployment directly:

```powershell
vercel --version
vercel link
vercel --prod
```

If not logged in, ask the user to run:

```powershell
vercel login
```

Do not request Vercel tokens in chat.

## Common Problems

- `vercel: command not found`: install Vercel CLI with the user's preferred package manager or use Git integration.
- `No existing credentials found`: user must run `vercel login`.
- Wrong app deployed in monorepo: run Vercel from the configured app root.
- Build succeeds locally but fails on Vercel: compare Node version, build command, output directory, and environment variables.
- Missing environment variables: set them in the Vercel project dashboard, not in chat.

## Safety Checklist

- Confirm `.env` is not staged.
- Confirm build output folders such as `dist/`, `.next/`, and `node_modules/` are ignored unless the repo intentionally tracks them.
- Avoid force push.
- Avoid deploying from an accidental branch unless the user approves.
