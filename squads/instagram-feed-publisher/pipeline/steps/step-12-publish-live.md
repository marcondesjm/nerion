---
execution: inline
agent: paula-publica
inputFile: squads/instagram-feed-publisher/output/live-publish-confirmation.md
outputFile: squads/instagram-feed-publisher/output/publish-result.md
---

# Step 12: Publish Live

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/live-publish-confirmation.md` - confirmacao explicita.
- `squads/instagram-feed-publisher/output/publish-preview.md` - dry-run.
- `squads/instagram-feed-publisher/output/carousel-copy.md` - legenda.
- `squads/instagram-feed-publisher/output/visuals.md` - imagens.

## Instructions

### Process
1. Confirmar que o usuario escolheu publicar ao vivo.
2. Executar publicacao com instagram-publisher.
3. Registrar URL, ID, timestamp ou erro.
4. Atualizar historico da run.

## Output Format

```markdown
# Publish Result

## Status

## URL

## Details

## Next Steps
```

## Output Example

# Publish Result

## Status
Published successfully.

## URL
https://www.instagram.com/p/example/

## Details
Platform: Instagram.
Post ID: example.
Published: 2026-05-19.

## Next Steps
Monitorar comentarios na primeira hora.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Nao ha confirmacao explicita.
2. API nao retorna sucesso ou erro claro.

## Quality Criteria

- [ ] Confirmacao lida.
- [ ] Resultado salvo.
- [ ] Sucesso inclui URL ou falha inclui erro.
