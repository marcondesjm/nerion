---
name: "git-vercel-deploy"
description: "Commit, push, and deploy projects through Git and Vercel. Use when Codex needs to publish local changes by inspecting git status, creating a safe commit, pushing to a remote branch, and triggering or verifying a Vercel deployment through Git integration, Vercel CLI, or Vercel dashboard guidance."
---

# Git Vercel Deploy

Use this skill to publish a project from local workspace to Git and then to the user's Vercel account.

## Core Workflow

1. Inspect the repository state:
   - Run `git status --short`.
   - Run `git branch --show-current`.
   - Run `git remote -v`.
   - If the directory is not a Git repository, stop and explain that a repository must be initialized or cloned first.

2. Protect user work:
   - Never run destructive Git commands such as `git reset --hard`, `git checkout --`, or force push unless the user explicitly requests it.
   - Review changed files before committing.
   - Do not include secrets such as `.env`, API keys, tokens, credentials, or private local config.
   - If sensitive files are tracked or staged, stop and ask the user how to proceed.

3. Validate the project before publishing:
   - Prefer the repo's build/test scripts when available.
   - For frontend/Vite/Next apps, run the normal build command.
   - If validation fails, fix the issue when in scope before committing.
   - If validation cannot be run, mention that clearly in the final response.

4. Commit:
   - Stage only relevant files for the user's requested change.
   - Use a concise commit message describing the change.
   - If there are unrelated changes, leave them unstaged unless the user asks to include them.

5. Push:
   - Push the current branch to its upstream.
   - If no upstream exists, push with `git push -u origin <branch>`.
   - If authentication is missing, tell the user to authenticate with their Git provider and retry.

6. Deploy to Vercel:
   - Prefer Git-triggered deployment when the repository is already connected to Vercel.
   - If Vercel CLI is installed and the user wants an immediate deploy, use `vercel --prod` from the app root.
   - If the project is not linked, use `vercel link` or guide the user to import the Git repository in Vercel.
   - Never ask the user to paste tokens into chat. Ask them to login locally with `vercel login` or set tokens in their shell/Vercel dashboard.

7. Verify:
   - Capture the pushed branch and commit hash.
   - Capture the Vercel deployment URL when available.
   - If using Git-triggered deploy, check Vercel CLI output, `vercel inspect <url>`, or tell the user where to confirm in the Vercel dashboard.

## Command Guidance

Use safe, non-interactive commands whenever possible:

```powershell
git status --short
git diff --stat
git branch --show-current
git remote -v
git add <files>
git commit -m "message"
git push
```

For Vercel:

```powershell
vercel --version
vercel link
vercel --prod
vercel inspect <deployment-url>
```

If a command fails because of network or authentication sandboxing, rerun it with escalation and a clear justification.

## App Root Selection

Before running Vercel commands, identify the deployable app root:

- Use the directory containing `package.json` and framework config when the repo is a single app.
- For monorepos, deploy from the package configured in Vercel, such as `apps/web` or `dashboard`.
- If unsure, inspect `vercel.json`, package scripts, and existing project structure.

## Final Response

Report only the useful deployment facts:

- Commit hash and branch pushed.
- Remote URL or repository.
- Vercel deployment URL or dashboard verification status.
- Tests/builds run.
- Any manual action still needed, such as GitHub login, Vercel login, or repository import.
