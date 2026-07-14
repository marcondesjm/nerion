$ErrorActionPreference = "Stop"
Set-Location "D:\NerionOs-main"
$env:AUTOPOST_ALLOW_INSECURE_TLS = "1"
node "D:\NerionOs-main\automation\instagram-autopost\daily-story-autopost.mjs" --dry-run --force

