# NerionOS Instagram Autopost

Automação local para publicar Stories diários em `@marcondes.machado.oficial`.

## O que faz

- Gera um Story 1080x1920.
- Valida PT-BR e bloqueia mojibake.
- Confirma que `INSTAGRAM_USER_ID` retorna `marcondes.machado.oficial`.
- Sobe imagem no imgBB.
- Cria container `STORIES`.
- Publica via Meta Graph API.
- Impede duplicidade no mesmo dia.
- Salva logs em `automation/instagram-autopost/runs/`.

## Teste

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\NerionOs-main\automation\instagram-autopost\run-daily-instagram-autopost-dry-run.ps1"
```

## Agendamento

Tarefa do Windows:

`NerionOS Instagram AutoPost`

Horário:

`09:00`

## Rodar sem o PC ligado

Use o workflow do GitHub Actions:

`.github/workflows/instagram-autopost.yml`

Ele roda todos os dias às `12:00 UTC`, equivalente a `09:00` em São Paulo.

Configure estes secrets no repositório GitHub:

- `INSTAGRAM_ACCESS_TOKEN`
- `INSTAGRAM_USER_ID`
- `IMGBB_API_KEY`

Depois vá em **Actions > NerionOS Instagram AutoPost** e rode manualmente primeiro com:

- `dry_run = true`
- `force = true`

Se passar, rode com:

- `dry_run = false`
- `force = true`

O agendamento diário roda automaticamente sem `dry_run`.

## Segurança

Credenciais ficam apenas no `.env`. O script não imprime tokens.
