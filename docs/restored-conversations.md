# Conversas restauradas

Atualizado em 2026-07-15.

Este arquivo resume o contexto recuperado a partir do indice global do Codex, dos rollouts em `C:\Users\Marcondes\.codex\sessions` e dos resumos em `C:\Users\Marcondes\.codex\memories\rollout_summaries`.

## Ultima conversa pratica neste repo

Conversa: `Continuar de onde parou`

Thread: `019f620f-c0f3-74d0-b1e2-9b1bcea65076`

Estado restaurado:

- O foco mais recente era a automacao do Instagram do NerionOS via Cloudflare Worker + GitHub Actions.
- Worker: `nerion-instagram-cron`.
- URL publica: `https://nerion-instagram-cron.marcondesgestaotrafego.workers.dev`.
- O Worker ficou com dois agendamentos oficiais:
  - Stories: `09:00` Sao Paulo.
  - Feed: `09:10` Sao Paulo.
- O teste agendado de `16:36` nao disparou, provavelmente por ter sido publicado muito perto do horario.
- O teste reagendado para `16:47` disparou corretamente pela Cloudflare e abriu os dois workflows no GitHub Actions.
- Os workflows terminaram com `success`:
  - `NerionOS Instagram AutoPost`.
  - `NerionOS Instagram Feed Daily`.
- O teste foi em `dry_run`, portanto validou a automacao sem publicar no Instagram.
- Depois do teste, o cron temporario foi removido e o `/health` final ficou apenas com `storyCron` e `feedCron`.
- O Git local estava limpo ao final.

Arquivos principais relacionados:

- `cloudflare/instagram-cron/src/index.js`
- `cloudflare/instagram-cron/wrangler.toml`
- `.github/workflows/instagram-autopost.yml`
- `.github/workflows/instagram-feed-1410.yml`
- `automation/instagram-autopost/daily-story-autopost.mjs`
- `automation/instagram-feed-autopost/publish-feed-carousel.mjs`

## Instagram publicado em 2026-07-14

O contexto recuperado tambem mostra que a publicacao real para `@marcondes.machado.oficial` foi feita antes da automacao final:

- Feed/carrossel publicado: `https://www.instagram.com/p/Daxst2jFHoL/`
- Story publicado: `https://www.instagram.com/stories/marcondes.machado.oficial/3941135076331648405`

Regra importante preservada:

- Antes de publicar qualquer texto em PT-BR, revisar acentos e bloquear mojibake como `Ã`, `Â`, `â` ou `�`.

## Ultron / landpages

Contexto restaurado de conversas anteriores:

- O fluxo real de criacao de landpage no Ultron usa `request_landing_page_creation`.
- O fluxo precisa de `client_slug`, `nome` e confirmacao em duas etapas: `confirm=false` e depois `confirm=true`.
- Em 2026-07-07 houve enqueue real de job para Bruno:
  - Job: `fa599b12-d8f4-4617-a60f-496f0d06369f`
  - `skill`: `create-landing-page-brunobracaioli`
  - `kind`: `landing`
  - `status`: `pending`
- `list_landing_pages` retornou vazio naquele momento, entao havia job enfileirado, mas nenhuma landing pronta para exibir.
- Para validar Ultron, nao basta HTTP 200; precisa confirmar efeito real em `agent_jobs` ou `landing_pages`.

## Onde buscar os historicos completos

Indice de conversas:

- `C:\Users\Marcondes\.codex\session_index.jsonl`

Sessao mais recente restaurada:

- `C:\Users\Marcondes\.codex\sessions\2026\07\14\rollout-2026-07-14T16-17-12-019f620f-c0f3-74d0-b1e2-9b1bcea65076.jsonl`

Resumos uteis:

- `C:\Users\Marcondes\.codex\memories\rollout_summaries\2026-07-14T12-32-31-FSeY-automatic_instagram_posting_env_check_and_blocker_hunt.md`
- `C:\Users\Marcondes\.codex\memories\rollout_summaries\2026-07-07T12-57-01-xfth-ultron_landing_page_real_create_and_show_flow.md`
- `C:\Users\Marcondes\.codex\memories\rollout_summaries\2026-07-06T14-14-09-SvhQ-ultron_landing_page_setup_light_test_and_live_quota_block.md`

