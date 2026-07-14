---
execution: subagent
agent: sofia-sinal
inputFile: squads/instagram-feed-publisher/output/research-focus.md
outputFile: squads/instagram-feed-publisher/output/topic-research.md
model_tier: powerful
---

# Step 02: Research Brief

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/research-focus.md` - tema e intervalo escolhidos.
- `squads/instagram-feed-publisher/pipeline/data/research-brief.md` - pesquisa base da squad.
- `_opensquad/_memory/company.md` - contexto da NerionOS.

## Instructions

### Process
1. Leia o foco e identifique se a pesquisa e temporal ou evergreen.
2. Colete achados relevantes para SaaS, UX, produto, conversao ou tecnologia.
3. Resuma apenas o que ajuda a criar um carrossel de Instagram.
4. Indique fontes, confianca, lacunas e recorte recomendado.

## Output Format

```markdown
# Topic Research

## Focus

## Key Findings

## Sources

## Recommended Content Angles

## Gaps
```

## Output Example

# Topic Research

## Focus
Onboarding ruim em SaaS, evergreen.

## Key Findings
1. Usuarios abandonam quando nao chegam rapido ao primeiro valor percebido.
2. A primeira experiencia deve reduzir decisao, nao adicionar passos.
3. Design de onboarding conecta promessa, acao e prova.

## Sources
- Fonte A, accessed 2026-05-19, confidence: medium.
- Fonte B, accessed 2026-05-19, confidence: medium.

## Recommended Content Angles
1. Seu SaaS nao perde usuario no preco. Perde no primeiro minuto confuso.
2. O onboarding e a segunda venda do SaaS.
3. Se voce precisa explicar a interface, ela ainda nao esta pronta.

## Gaps
Dados variam por categoria de SaaS.

## Veto Conditions

Reject and redo if ANY of these are true:
1. O briefing nao tem fontes ou confianca.
2. O briefing nao sugere angulos acionaveis.

## Quality Criteria

- [ ] Tem 3 achados uteis.
- [ ] Tem recorte recomendado.
- [ ] Tem fontes ou lacunas claras.
