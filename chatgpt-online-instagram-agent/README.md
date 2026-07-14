# NerionOS Daily Instagram Agent

Pacote pronto para configurar um agente diário de Instagram para a NerionOS / Marcondes Machado.

## Objetivo

Gerar, revisar e publicar diariamente conteúdo em:

- Instagram Feed / carrossel
- Instagram Stories
- Conta alvo: `@marcondes.machado.oficial`

## Arquivos

- `AGENT.md`: instruções completas do agente.
- `SKILL.md`: skill reutilizável para criação e publicação.
- `DAILY_TASK_PROMPT.md`: prompt pronto para tarefa agendada diária no ChatGPT Work/Codex.
- `ENV.example`: variáveis necessárias.
- `CHECKLIST.md`: checklist obrigatório antes de publicar.
- `scripts/publish-instagram.mjs`: script base para publicar via Meta Graph API.

## Regras críticas

1. Nunca publicar se houver texto com encoding quebrado, como `nÃ£o`, `FlorianÃ³polis`, `Ã`, `Â`, `â` ou `�`.
2. Sempre usar PT-BR com acentos corretos.
3. Publicar somente na conta `@marcondes.machado.oficial`.
4. Usar token em variável de ambiente, nunca colar credenciais no prompt.
5. Fazer dry-run antes de publish.
6. Se a publicação for automática diária, mantenha uma aprovação humana ou uma regra explícita e registrada de autorização.

## Como usar no ChatGPT online

1. Abra ChatGPT Work/Codex.
2. Crie ou selecione um projeto com estes arquivos.
3. Adicione as variáveis de ambiente/segredos:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_USER_ID`
   - `IMGBB_API_KEY`
4. Crie uma tarefa agendada diária usando o conteúdo de `DAILY_TASK_PROMPT.md`.
5. Defina o horário desejado.

Observação: publicação em rede social é ação externa de alto impacto. Prefira aprovação humana, pelo menos até o fluxo estar estável.

