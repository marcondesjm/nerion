---
execution: inline
agent: renata-revisao
inputFile: squads/instagram-feed-publisher/output/visuals.md
outputFile: squads/instagram-feed-publisher/output/review.md
on_reject: 5
---

# Step 08: Review Content

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/carousel-copy.md` - copy final.
- `squads/instagram-feed-publisher/output/visuals.md` - visual.
- `squads/instagram-feed-publisher/pipeline/data/quality-criteria.md` - criterios.

## Instructions

### Process
1. Revise copy, formato, CTA, hashtags e marca.
2. Revise visual, legibilidade e consistencia.
3. Dê notas, justificativas e veredito.
4. Se rejeitar, explique ajustes obrigatorios.

## Output Format

```markdown
# Review

## Verdict

## Scores

## Strengths

## Required Changes

## Suggestions
```

## Output Example

# Review

## Verdict
APPROVE.

## Scores
Copy: 8/10 porque hook e claro.
Visual: 8/10 porque hierarquia esta forte.
Brand: 9/10 porque conecta SaaS e conversao.
Publishing readiness: 8/10.

## Strengths
O conteudo tem uma dor clara e CTA especifico.

## Required Changes
Nenhuma.

## Suggestions
Reduzir uma frase no slide 4.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Falta CTA.
2. Algum criterio critico fica abaixo de 4/10.

## Quality Criteria

- [ ] Veredito claro.
- [ ] Notas justificadas.
- [ ] Ajustes acionaveis.
