---
execution: inline
agent: igor-instagram
format: instagram-feed
inputFile: squads/instagram-feed-publisher/output/topic-research.md
outputFile: squads/instagram-feed-publisher/output/angles.md
---

# Step 03: Generate Angles

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/topic-research.md` - briefing do tema.
- `squads/instagram-feed-publisher/pipeline/data/tone-of-voice.md` - tons disponiveis.
- `squads/instagram-feed-publisher/pipeline/data/domain-framework.md` - estrutura operacional.

## Instructions

### Process
1. Leia o briefing e identifique a dor central.
2. Gere 3 angulos diferentes para o mesmo tema.
3. Para cada angulo, inclua hook, driver psicologico, formato e justificativa.
4. Recomende um dos angulos, mas aguarde escolha do usuario.

## Output Format

```markdown
# Angle Options

## Option 1
Hook:
Driver:
Format:
Why it works:

## Option 2

## Option 3

## Recommendation
```

## Output Example

# Angle Options

## Option 1
Hook: Seu SaaS nao perde usuario no preco. Perde no primeiro minuto confuso.
Driver: medo de perda.
Format: Problema -> Solucao.
Why it works: liga onboarding ruim a perda de conversao.

## Option 2
Hook: O onboarding e a segunda venda do seu SaaS.
Driver: controle.
Format: Editorial.
Why it works: reinterpreta onboarding como venda de valor.

## Option 3
Hook: Se voce precisa explicar a interface, ela ainda nao esta pronta.
Driver: status.
Format: Mito vs Realidade.
Why it works: e direto, memoravel e provocativo.

## Recommendation
Use a opcao 1 para um carrossel mais forte e compartilhavel.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Os 3 hooks dizem a mesma coisa.
2. Nenhum angulo conecta com SaaS ou NerionOS.

## Quality Criteria

- [ ] Tres hooks distintos.
- [ ] Formato indicado.
- [ ] Justificativa clara.
