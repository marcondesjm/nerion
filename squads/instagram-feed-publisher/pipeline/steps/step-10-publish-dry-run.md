---
execution: inline
agent: paula-publica
inputFile: squads/instagram-feed-publisher/output/final-approval.md
outputFile: squads/instagram-feed-publisher/output/publish-preview.md
---

# Step 10: Publish Dry Run

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/final-approval.md` - aprovacao final.
- `squads/instagram-feed-publisher/output/carousel-copy.md` - legenda e hashtags.
- `squads/instagram-feed-publisher/output/visuals.md` - imagens.

## Instructions

### Process
1. Validar imagens, legenda e requisitos do Instagram.
2. Apresentar preview completo.
3. Executar dry-run se credenciais estiverem configuradas.
4. Registrar status e proximos passos.

## Output Format

```markdown
# Publish Preview

## Validation

## Dry-Run Result

## Awaiting Confirmation
```

## Output Example

# Publish Preview

## Validation
Platform: Instagram.
Type: carousel.
Images: 8 slides, JPEG, 1080x1440.
Caption: 1240/2200 chars.
Hashtags: 7.
Status: validation passed.

## Dry-Run Result
Dry-run pending credentials or passed.

## Awaiting Confirmation
Confirmar publicacao ao vivo somente depois de revisar este preview.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Falta imagem ou caption.
2. A validacao do Instagram falha.

## Quality Criteria

- [ ] Preview completo.
- [ ] Dry-run registrado.
- [ ] Sem publicacao ao vivo nesta etapa.
