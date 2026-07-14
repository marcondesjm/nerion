---
execution: inline
agent: igor-instagram
format: instagram-feed
inputFile: squads/instagram-feed-publisher/output/selected-angle.md
outputFile: squads/instagram-feed-publisher/output/carousel-copy.md
---

# Step 05: Create Carousel

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/selected-angle.md` - angulo escolhido.
- `squads/instagram-feed-publisher/output/topic-research.md` - pesquisa.
- `squads/instagram-feed-publisher/pipeline/data/output-examples.md` - exemplos.
- `squads/instagram-feed-publisher/pipeline/data/quality-criteria.md` - criterios.

## Instructions

### Process
1. Escreva o carrossel no formato Instagram Feed.
2. Inclua formato, slides, legenda e hashtags.
3. Mantenha tom descontraido sharp.
4. Garanta CTA especifico no slide final e na legenda.

## Output Format

```markdown
# Carousel Copy

## Format

## Slides

## Caption

## Hashtags
```

## Output Example

# Carousel Copy

## Format
Problema -> Solucao.

## Slides
Slide 1: Seu SaaS nao perde usuario no preco. Perde no primeiro minuto confuso.
Slide 2: A pessoa entrou curiosa. Mas o produto pediu esforco antes de mostrar valor.
Slide 3: Isso cria duvida, abandono e um suporte cheio de perguntas repetidas.
Slide 4: O problema nao e falta de feature. E falta de jornada.
Slide 5: Uma boa jornada mostra promessa, acao e prova na ordem certa.
Slide 6: Discovery encontra onde o usuario trava. UX transforma isso em fluxo.
Slide 7: Interface boa nao explica demais. Ela conduz.
Slide 8: Salve antes de mexer no seu onboarding.

## Caption
Seu SaaS pode estar perdendo usuario antes dele entender o valor.

## Hashtags
#saas #uxdesign #productdesign #mvp #conversao #startupbrasil

## Veto Conditions

Reject and redo if ANY of these are true:
1. Nao ha CTA.
2. O carrossel nao tem uma ideia central.

## Quality Criteria

- [ ] 6 a 10 slides.
- [ ] Hook forte na capa.
- [ ] Legenda com CTA.
