---
name: nerionos-instagram-daily-publisher
description: Cria, revisa e publica conteúdo diário no Instagram da NerionOS/Marcondes com validação de PT-BR, arte, dry-run e publicação via Meta Graph API.
type: workflow
version: "1.0.0"
env:
  - INSTAGRAM_ACCESS_TOKEN
  - INSTAGRAM_USER_ID
  - IMGBB_API_KEY
  - TARGET_INSTAGRAM_USERNAME
---

# Skill: NerionOS Instagram Daily Publisher

## Quando usar

Use esta skill quando precisar criar ou publicar conteúdo diário no Instagram da NerionOS / Marcondes Machado.

## Entradas

- Tema do dia.
- Formato desejado: `feed`, `story` ou `ambos`.
- Conta alvo: `@marcondes.machado.oficial`.
- Variáveis de ambiente configuradas.

## Saídas

- Copy final em PT-BR.
- Imagem final.
- Dry-run result.
- Publish result com URL.

## Passo 1: Validar conta

Consultar:

```text
GET /{INSTAGRAM_USER_ID}?fields=id,username
```

Exigir:

```text
username = marcondes.machado.oficial
```

## Passo 2: Criar conteúdo

Escolher um ângulo de IA aplicada a empresas.

Exemplos:

- IA solta não escala. Agentes com processo, sim.
- Seu time não precisa de mais uma ferramenta. Precisa de uma rotina inteligente.
- Prompt ajuda uma pessoa. Skill ajuda o time inteiro.
- Automação sem processo vira bagunça mais rápida.

## Passo 3: Revisar PT-BR

Antes de publicar, verificar se o texto contém:

```text
Ã
Â
â
�
nÃ
FlorianÃ
operaÃ
decisÃ
conteÃ
```

Se encontrar, parar e corrigir.

## Passo 4: Criar imagem

Formatos:

- Feed/carrossel: `1080x1440`
- Story: `1080x1920`

Visual:

- Fundo escuro premium.
- Verde NerionOS como acento.
- Texto grande e legível.
- Assinatura NerionOS.
- Sem texto pequeno.

## Passo 5: Dry-run

Executar dry-run antes de publicar.

Requisitos para passar:

- Upload da imagem ok.
- Container criado.
- Container processado.
- Conta correta.

## Passo 6: Publicar

Publicar via:

```text
POST /{INSTAGRAM_USER_ID}/media_publish
```

Registrar:

- media ID
- URL/permalink quando disponível
- timestamp
- tipo: feed/story

## Falhas

Se token expirar:

Parar e pedir renovação do `INSTAGRAM_ACCESS_TOKEN`.

Se conta alvo não bater:

Parar. Não publicar.

Se houver mojibake:

Parar. Corrigir PT-BR antes de prosseguir.

