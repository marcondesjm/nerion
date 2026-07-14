---
execution: inline
agent: diego-design
inputFile: squads/instagram-feed-publisher/output/copy-approval.md
outputFile: squads/instagram-feed-publisher/output/visuals.md
---

# Step 07: Design Slides

## Context Loading

Load these files before executing:
- `squads/instagram-feed-publisher/output/carousel-copy.md` - copy aprovada.
- `squads/instagram-feed-publisher/pipeline/data/quality-criteria.md` - criterios visuais.
- `_opensquad/_memory/company.md` - contexto da marca.

## Instructions

### Process
1. Defina sistema visual para Instagram 1080x1440.
2. Especifique layout de cada slide.
3. Gere ou indique arquivos de imagem/renderizacao.
4. Verifique legibilidade e consistencia.

## Output Format

```markdown
# Visual Production

## Design System

## Slide Specs

## Rendered Assets

## Notes
```

## Output Example

# Visual Production

## Design System
Viewport: 1080x1440.
Colors: #080A0F, #F7F7F2, #75F0A2, #B6BDC7.
Typography: Inter, hero 72px, heading 48px, body 34px.

## Slide Specs
Slide 1: dark cover, hero hook centered.
Slide 2: light diagnostic slide.
Slide 3: dark problem slide.
Slide 4: accent bridge slide.
Slide 8: CTA slide.

## Rendered Assets
Pending render.

## Notes
No slide counters. Keep contrast high.

## Veto Conditions

Reject and redo if ANY of these are true:
1. Texto nao fica legivel em mobile.
2. Sistema visual nao e consistente.

## Quality Criteria

- [ ] 1080x1440.
- [ ] Sistema visual definido.
- [ ] Slides sem placeholder.
