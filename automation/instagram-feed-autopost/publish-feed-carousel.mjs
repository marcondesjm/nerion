#!/usr/bin/env node
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const AUTO_DIR = resolve(ROOT, 'automation', 'instagram-feed-autopost');
const RUNS_DIR = join(AUTO_DIR, 'runs');
const IG_BASE = 'https://graph.facebook.com/v21.0';
const EXPECTED_USERNAME = 'marcondes.machado.oficial';

const DAILY_PACKS = [
  {
    slides: [
      { eyebrow: 'Nerion OS', title: 'IA solta não escala.', body: 'Quando cada pessoa usa IA de um jeito, o resultado vira improviso.' },
      { eyebrow: 'O salto real', title: 'Agentes com processo, sim.', body: 'A empresa ganha quando transforma tarefas repetidas em fluxos claros, medidos e treináveis.' },
      { eyebrow: 'Na prática', title: 'Skill é o manual vivo.', body: 'Ela documenta contexto, padrão de qualidade, entrada, saída e modo de execução.' },
      { eyebrow: 'Operação inteligente', title: 'Agente executa com padrão.', body: 'Atendimento, comercial, suporte, conteúdo e decisão ganham velocidade sem perder controle.' },
      { eyebrow: 'Comece pequeno', title: 'Escolha um processo.', body: 'A NerionOS desenha o fluxo, cria a skill e coloca o agente para trabalhar.' }
    ],
    caption: `IA solta não escala. Agentes com processo, sim.

O ponto real não é testar ferramenta nova. É descobrir onde a IA reduz retrabalho, acelera decisão e cria padrão para o time inteiro operar melhor.

No NerionOS, a IA entra como sistema de operação: skills documentadas, agentes especializados, fluxos conectados e critérios de qualidade.

Prompt sozinho ajuda uma pessoa. Processo com agente ajuda a empresa.

Comente IA ou chame no direct para mapear o primeiro agente da sua operação.

#nerionos #inteligenciaartificial #agentesia #automacao #negociosdigitais #inovacao #empresasinteligentes`
  },
  {
    slides: [
      { eyebrow: 'Skill', title: 'Conhecimento precisa virar rotina.', body: 'Se o padrão fica só na cabeça de uma pessoa, a empresa perde velocidade.' },
      { eyebrow: 'Contexto', title: 'A skill guarda o jeito certo.', body: 'Ela registra critério, tom, dados, limites e exemplos para o agente executar melhor.' },
      { eyebrow: 'Agente', title: 'Execução sem recomeçar do zero.', body: 'Cada tarefa parte de um protocolo claro, não de improviso.' },
      { eyebrow: 'Gestão', title: 'Menos dependência individual.', body: 'O time ganha consistência porque o conhecimento fica operacionalizado.' },
      { eyebrow: 'NerionOS', title: 'Transforme know-how em sistema.', body: 'Mapeie um processo, escreva a skill e coloque um agente para rodar.' }
    ],
    caption: `Toda empresa tem conhecimento importante preso em conversas, planilhas e pessoas-chave.

Skills resolvem isso: transformam contexto, critério e padrão de qualidade em uma rotina que agentes conseguem executar.

Quando a skill fica clara, o agente não improvisa. Ele segue um jeito de trabalhar que pode ser revisado, melhorado e repetido.

Esse é o caminho prático para IA em empresas: menos dependência individual, mais operação inteligente.

#skills #agentesia #nerionos #inteligenciaartificial #automacao #gestao #produtividade`
  },
  {
    slides: [
      { eyebrow: 'Atendimento', title: 'IA não é só chatbot.', body: 'O valor aparece quando o atendimento entende contexto, prioridade e próximo passo.' },
      { eyebrow: 'Skill', title: 'Padrão antes da resposta.', body: 'A skill define tom, políticas, perguntas obrigatórias e critérios de encaminhamento.' },
      { eyebrow: 'Agente', title: 'Resolução com trilha.', body: 'O agente coleta dados, classifica, responde e aciona o fluxo certo.' },
      { eyebrow: 'Empresa', title: 'Menos fila, mais clareza.', body: 'O time humano recebe casos melhor organizados, com histórico e recomendação.' },
      { eyebrow: 'NerionOS', title: 'Atendimento vira operação.', body: 'A IA trabalha dentro de um processo, não solta em uma caixa de mensagem.' }
    ],
    caption: `IA em atendimento não deveria ser apenas um chatbot respondendo rápido.

O ganho real vem quando existe processo: skill com critérios, agente com papel claro e fluxo conectado ao time humano.

Assim a IA coleta informações, classifica urgência, responde com padrão e encaminha o que precisa de decisão.

Velocidade com controle. Automação com contexto.

#atendimento #inteligenciaartificial #agentesia #nerionos #automacao #experienciadocliente`
  },
  {
    slides: [
      { eyebrow: 'Comercial', title: 'Lead bom não pode esfriar.', body: 'A velocidade entre interesse e resposta muda o resultado da venda.' },
      { eyebrow: 'Agente', title: 'Triagem em minutos.', body: 'O agente identifica perfil, dor, urgência e melhor próxima ação.' },
      { eyebrow: 'Skill', title: 'Discurso comercial com padrão.', body: 'A skill guarda oferta, objeções, tom, perguntas e critérios de qualificação.' },
      { eyebrow: 'Pipeline', title: 'Menos follow-up perdido.', body: 'A automação lembra, organiza e prepara o vendedor para entrar no momento certo.' },
      { eyebrow: 'NerionOS', title: 'Venda com IA operacional.', body: 'Não é sobre substituir o comercial. É dar sistema para ele vender melhor.' }
    ],
    caption: `No comercial, IA boa não é a que fala bonito. É a que reduz atraso, organiza contexto e ajuda o time a agir no momento certo.

Com skills, o agente aprende o padrão da oferta, as perguntas de qualificação e os critérios de prioridade.

Com fluxo, ele registra dados, prepara follow-ups e entrega uma próxima ação clara.

IA em empresas precisa aparecer no pipeline, não apenas em ideias.

#vendas #crm #agentesia #nerionos #automacao #inteligenciaartificial #negocios`
  },
  {
    slides: [
      { eyebrow: 'Conteúdo', title: 'Post diário também precisa de sistema.', body: 'Criatividade melhora quando existe pauta, critério e rotina.' },
      { eyebrow: 'Skill', title: 'A marca ganha memória.', body: 'Tom de voz, temas, proibições, exemplos e formatos ficam documentados.' },
      { eyebrow: 'Agente', title: 'Execução com variação.', body: 'O agente cria novas abordagens sem fugir do posicionamento.' },
      { eyebrow: 'Operação', title: 'Publicar deixa de ser improviso.', body: 'Roteiro, arte, legenda e revisão entram em uma esteira previsível.' },
      { eyebrow: 'NerionOS', title: 'Marketing com agentes.', body: 'Menos branco na tela. Mais consistência para construir autoridade.' }
    ],
    caption: `Conteúdo diário não precisa depender de inspiração aleatória.

Com uma skill bem feita, a marca ganha memória: tom de voz, temas, exemplos, critérios de qualidade e limites.

Com agentes, a operação cria novas abordagens sem perder consistência.

Esse é o uso prático de IA no marketing: transformar conteúdo em sistema.

#marketingdigital #conteudo #agentesia #skills #nerionos #automacao #inteligenciaartificial`
  },
  {
    slides: [
      { eyebrow: 'Operação', title: 'O gargalo nem sempre é falta de gente.', body: 'Muitas vezes é falta de fluxo claro para tarefas repetidas.' },
      { eyebrow: 'Diagnóstico', title: 'Mapeie a rotina cansativa.', body: 'Procure onde o time copia, cola, confere, reescreve e cobra status.' },
      { eyebrow: 'Skill', title: 'Defina o padrão.', body: 'Entrada, saída, critério, exceção e exemplos viram instrução operacional.' },
      { eyebrow: 'Agente', title: 'Rode a rotina.', body: 'O agente executa, registra resultado e chama humanos quando precisa.' },
      { eyebrow: 'NerionOS', title: 'Automação com governança.', body: 'IA boa não bagunça a empresa. Ela organiza o trabalho.' }
    ],
    caption: `Antes de automatizar, escolha a rotina certa.

O melhor primeiro agente geralmente nasce onde existe repetição: copiar dados, conferir informação, responder padrão, atualizar status, preparar material.

A skill define o padrão. O agente executa. O fluxo registra e mede.

IA em empresas precisa reduzir atrito operacional todos os dias.

#operacao #automacao #iaempresas #agentesia #skills #nerionos #produtividade`
  },
  {
    slides: [
      { eyebrow: 'Gestão', title: 'IA precisa de critério.', body: 'Sem critério, a empresa ganha velocidade para errar mais rápido.' },
      { eyebrow: 'Qualidade', title: 'Defina o que é bom.', body: 'A skill registra padrões, exemplos aprovados e sinais de alerta.' },
      { eyebrow: 'Agente', title: 'Execute com verificação.', body: 'O agente produz, checa requisitos e separa exceções para revisão.' },
      { eyebrow: 'Aprendizado', title: 'Melhore a cada rodada.', body: 'Feedback vira ajuste de skill, não apenas correção manual.' },
      { eyebrow: 'NerionOS', title: 'IA como sistema vivo.', body: 'Agentes melhores nascem de processos que aprendem.' }
    ],
    caption: `A pergunta não é apenas: "qual IA vamos usar?"

A pergunta mais importante é: "qual critério essa IA precisa seguir para ajudar a empresa com segurança?"

Skills tornam esse critério explícito. Agentes executam com verificação. Feedback melhora o sistema.

E assim a IA sai do teste isolado e vira operação viva.

#gestao #qualidade #inteligenciaartificial #agentesia #skills #nerionos #empresas`
  }
  ,
  {
    slides: [
      { eyebrow: 'Financeiro', title: 'Número solto não vira gestão.', body: 'Relatório só ajuda quando aponta risco, prioridade e próxima decisão.' },
      { eyebrow: 'Skill', title: 'Critério antes do dashboard.', body: 'A skill define quais dados importam, como conferir e quando acionar o time.' },
      { eyebrow: 'Agente', title: 'Rotina financeira sem atraso.', body: 'O agente cruza cobranças, vencimentos, status e pendências todos os dias.' },
      { eyebrow: 'Gestão', title: 'Menos surpresa no caixa.', body: 'Alertas claros ajudam a empresa a agir antes do problema virar urgência.' },
      { eyebrow: 'NerionOS', title: 'Dados viram operação.', body: 'A IA organiza o caminho entre informação, análise e ação.' }
    ],
    caption: `Empresa inteligente não olha número só no fim do mês.

O valor aparece quando a IA acompanha a rotina: cobranças, vencimentos, pendências, indicadores e alertas.

Com skills, o agente sabe o que conferir. Com fluxo, ele entrega contexto para a pessoa certa decidir melhor.

Financeiro com IA não é planilha bonita. É operação com menos surpresa.

#financeiro #gestao #inteligenciaartificial #agentesia #nerionos #automacao #empresas`
  },
  {
    slides: [
      { eyebrow: 'Pós-venda', title: 'Cliente não pode sumir do radar.', body: 'A experiência melhora quando acompanhamento vira rotina, não lembrança ocasional.' },
      { eyebrow: 'Skill', title: 'Sinais de atenção ficam claros.', body: 'A skill registra prazos, promessas, dúvidas frequentes e momentos de contato.' },
      { eyebrow: 'Agente', title: 'Follow-up com contexto.', body: 'O agente lembra, prepara a conversa e aponta quem precisa de cuidado.' },
      { eyebrow: 'Operação', title: 'Menos perda silenciosa.', body: 'Problemas pequenos aparecem antes de virarem cancelamento ou reclamação.' },
      { eyebrow: 'NerionOS', title: 'Relacionamento com sistema.', body: 'A IA ajuda o time a cuidar melhor sem depender de memória individual.' }
    ],
    caption: `Pós-venda bom não depende de alguém lembrar no improviso.

Com IA aplicada ao processo, cada cliente pode ter acompanhamento, contexto e próximo passo organizado.

A skill define o padrão de cuidado. O agente observa sinais. O fluxo coloca a informação no lugar certo.

O resultado é simples: menos cliente esquecido, mais relacionamento bem conduzido.

#posvenda #experienciadocliente #agentesia #skills #nerionos #automacao #negocios`
  },
  {
    slides: [
      { eyebrow: 'RH', title: 'Onboarding não deveria ser informal.', body: 'Quando cada pessoa ensina de um jeito, o novo colaborador começa no escuro.' },
      { eyebrow: 'Skill', title: 'Conhecimento vira trilha.', body: 'Processos, regras, exemplos e materiais ficam organizados para consulta.' },
      { eyebrow: 'Agente', title: 'Dúvida respondida com padrão.', body: 'O agente orienta, encontra documentos e encaminha exceções para humanos.' },
      { eyebrow: 'Gestão', title: 'Menos dependência de boca a boca.', body: 'A empresa preserva conhecimento e acelera adaptação sem perder qualidade.' },
      { eyebrow: 'NerionOS', title: 'Aprendizado operacional.', body: 'A IA transforma orientação interna em sistema vivo.' }
    ],
    caption: `Onboarding não precisa ser um monte de mensagens soltas.

Quando a empresa documenta processos em skills, agentes conseguem orientar pessoas com mais consistência.

Isso reduz dependência de boca a boca, acelera adaptação e preserva o jeito certo de trabalhar.

RH com IA não é substituir acolhimento. É dar suporte melhor para quem está chegando.

#rh #onboarding #gestao #agentesia #skills #nerionos #produtividade`
  },
  {
    slides: [
      { eyebrow: 'Suporte', title: 'Chamado sem contexto custa caro.', body: 'O tempo vai embora quando o time precisa descobrir tudo de novo.' },
      { eyebrow: 'Skill', title: 'Triagem com regra clara.', body: 'A skill define perguntas, prioridades, categorias e critérios de encaminhamento.' },
      { eyebrow: 'Agente', title: 'Resumo pronto para ação.', body: 'O agente coleta dados, organiza histórico e entrega o caso mais limpo.' },
      { eyebrow: 'Operação', title: 'Menos troca de mensagem.', body: 'O time recebe o problema com contexto suficiente para resolver mais rápido.' },
      { eyebrow: 'NerionOS', title: 'Suporte com inteligência.', body: 'IA boa reduz ruído antes de tentar responder tudo sozinha.' }
    ],
    caption: `Suporte fica caro quando cada chamado começa do zero.

A IA ajuda mais quando organiza contexto: quem é o cliente, qual é o problema, o que já foi tentado e qual prioridade.

Com skill e agente, a triagem fica mais clara. O time humano entra com menos ruído e mais direção.

Esse é o tipo de automação que melhora operação de verdade.

#suporte #atendimento #agentesia #nerionos #automacao #experienciadocliente`
  },
  {
    slides: [
      { eyebrow: 'Diretoria', title: 'Decisão lenta também é custo.', body: 'Quando a informação chega tarde, a empresa reage em vez de conduzir.' },
      { eyebrow: 'Skill', title: 'Indicador precisa de leitura.', body: 'A skill separa dado importante, variação relevante e sinal de alerta.' },
      { eyebrow: 'Agente', title: 'Resumo executivo todo dia.', body: 'O agente transforma dados espalhados em pontos de atenção e próximos passos.' },
      { eyebrow: 'Gestão', title: 'Mais clareza para priorizar.', body: 'A liderança enxerga onde agir antes que o problema cresça.' },
      { eyebrow: 'NerionOS', title: 'IA para governar melhor.', body: 'Processo, indicador e agente trabalham juntos para reduzir cegueira operacional.' }
    ],
    caption: `Diretoria não precisa de mais dado solto. Precisa de leitura.

IA aplicada à gestão ajuda quando transforma informação em sinal: o que mudou, por que importa e qual ação merece prioridade.

Com skills, os critérios ficam explícitos. Com agentes, a leitura acontece com frequência.

Menos relatório parado. Mais decisão com contexto.

#gestao #lideranca #inteligenciaartificial #agentesia #nerionos #dados #negocios`
  },
  {
    slides: [
      { eyebrow: 'Operações', title: 'Processo invisível não melhora.', body: 'Se ninguém mede a rotina, ninguém sabe onde a empresa perde tempo.' },
      { eyebrow: 'Skill', title: 'Mapeie entrada e saída.', body: 'A skill descreve começo, fim, exceções, responsáveis e critérios de qualidade.' },
      { eyebrow: 'Agente', title: 'Execução com registro.', body: 'O agente roda tarefas, salva evidências e mostra gargalos recorrentes.' },
      { eyebrow: 'Gestão', title: 'Melhoria deixa rastro.', body: 'Cada rodada gera aprendizado para ajustar fluxo, regra e prioridade.' },
      { eyebrow: 'NerionOS', title: 'Rotina que aprende.', body: 'A IA vira parte do sistema operacional da empresa.' }
    ],
    caption: `O que não aparece na operação dificilmente melhora.

Agentes ajudam quando executam e registram: o que entrou, o que saiu, onde travou e qual exceção apareceu.

Com esse rastro, a empresa deixa de depender de impressão e começa a melhorar processo com evidência.

IA útil é aquela que trabalha todos os dias no fluxo real.

#operacoes #processos #agentesia #skills #nerionos #produtividade #automacao`
  },
  {
    slides: [
      { eyebrow: 'Conhecimento', title: 'Documento parado não treina ninguém.', body: 'A empresa precisa transformar conhecimento em uso diário.' },
      { eyebrow: 'Skill', title: 'Manual vivo, não arquivo morto.', body: 'A skill organiza contexto, exemplos, limites e padrões de decisão.' },
      { eyebrow: 'Agente', title: 'Aplicação no momento certo.', body: 'O agente consulta a skill enquanto executa, responde ou prepara uma entrega.' },
      { eyebrow: 'Equipe', title: 'O padrão fica disponível.', body: 'Menos dependência de uma pessoa específica. Mais consistência no time.' },
      { eyebrow: 'NerionOS', title: 'Conhecimento em movimento.', body: 'A IA transforma memória da empresa em operação prática.' }
    ],
    caption: `Conhecimento parado em documento raramente muda a operação.

O salto acontece quando esse conhecimento vira skill: contexto, regra, exemplo, limite e padrão de qualidade.

Daí o agente consegue aplicar esse padrão no trabalho real, todos os dias.

É assim que a empresa reduz dependência individual e ganha consistência.

#conhecimento #skills #agentesia #nerionos #gestao #produtividade #inteligenciaartificial`
  }
];

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    validateCopy: argv.includes('--validate-copy'),
    renderOnly: argv.includes('--render-only')
  };
}

function loadEnv() {
  const env = { ...process.env };
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return env;
  const raw = readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#][^=]+)=(.*)$/);
    if (match && !env[match[1].trim()]) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

function assertNoMojibake(text) {
  const markers = ['Ã', 'Â', 'â', '�'];
  const found = markers.find((marker) => text.includes(marker));
  if (found) throw new Error(`Texto contem mojibake (${found}). Corrija antes de publicar.`);
}

const PLAIN_ASCII_PORTUGUESE = [
  ['nao', 'não'],
  ['operacao', 'operação'],
  ['automacao', 'automação'],
  ['conteudo', 'conteúdo'],
  ['criterio', 'critério'],
  ['criterios', 'critérios'],
  ['explicito', 'explícito'],
  ['padrao', 'padrão'],
  ['padroes', 'padrões'],
  ['treinaveis', 'treináveis'],
  ['politicas', 'políticas'],
  ['obrigatorias', 'obrigatórias'],
  ['rapido', 'rápido'],
  ['tambem', 'também'],
  ['diario', 'diário'],
  ['proibicoes', 'proibições'],
  ['dependencia', 'dependência'],
  ['cabeca', 'cabeça'],
  ['recomecar', 'recomeçar'],
  ['resolucao', 'resolução'],
  ['decisao', 'decisão'],
  ['execucao', 'execução'],
  ['informacoes', 'informações'],
  ['proximo', 'próximo'],
  ['proxima', 'próxima'],
  ['historico', 'histórico'],
  ['recomendacao', 'recomendação'],
  ['urgencia', 'urgência'],
  ['objecoes', 'objeções'],
  ['qualificacao', 'qualificação'],
  ['acao', 'ação'],
  ['variacao', 'variação'],
  ['revisao', 'revisão'],
  ['previsivel', 'previsível'],
  ['consistencia', 'consistência'],
  ['aleatoria', 'aleatória'],
  ['diagnostico', 'diagnóstico'],
  ['repeticao', 'repetição'],
  ['informacao', 'informação'],
  ['saida', 'saída'],
  ['excecao', 'exceção'],
  ['instrucao', 'instrução'],
  ['governanca', 'governança'],
  ['bagunca', 'bagunça'],
  ['verificacao', 'verificação'],
  ['correcao', 'correção'],
  ['seguranca', 'segurança'],
  ['pratica', 'prática'],
  ['pratico', 'prático'],
  ['gestao', 'gestão']
];

function stripHashtagLines(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n');
}

function assertPortugueseAccents(text) {
  const searchable = stripHashtagLines(text);
  const found = PLAIN_ASCII_PORTUGUESE.find(([plain]) => {
    const pattern = new RegExp(`(^|[^\\p{L}])${plain}([^\\p{L}]|$)`, 'iu');
    return pattern.test(searchable);
  });
  if (found) {
    throw new Error(`Texto sem acento: use "${found[1]}" no lugar de "${found[0]}".`);
  }
}

function timestampSaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}-${map.hour}${map.minute}${map.second}`;
}

function todaySaoPaulo() {
  return timestampSaoPaulo().slice(0, 10);
}

function daysSinceEpoch(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function pickDailyPack(dateString) {
  return DAILY_PACKS[daysSinceEpoch(dateString) % DAILY_PACKS.length];
}

const VISUAL_STYLES = [
  {
    name: 'mint-grid',
    accent: '#7CFFB2',
    accentSoft: 'rgba(124,255,178,0.18)',
    grid: 'rgba(124,255,178,0.10)',
    bgTop: '#0B1014',
    bgBottom: '#121A20',
    text: '#F4F7F5',
    muted: '#DDE5DF'
  },
  {
    name: 'cyan-map',
    accent: '#67D8FF',
    accentSoft: 'rgba(103,216,255,0.16)',
    grid: 'rgba(103,216,255,0.11)',
    bgTop: '#071116',
    bgBottom: '#10202A',
    text: '#F6FBFF',
    muted: '#D6E7EF'
  },
  {
    name: 'amber-signal',
    accent: '#FFD166',
    accentSoft: 'rgba(255,209,102,0.16)',
    grid: 'rgba(255,209,102,0.10)',
    bgTop: '#11100A',
    bgBottom: '#1D1A12',
    text: '#FFF8E8',
    muted: '#E9DEC4'
  },
  {
    name: 'rose-ops',
    accent: '#FF8FAB',
    accentSoft: 'rgba(255,143,171,0.15)',
    grid: 'rgba(255,143,171,0.10)',
    bgTop: '#120B10',
    bgBottom: '#21141C',
    text: '#FFF5F8',
    muted: '#ECD7DF'
  }
];

function pickVisualStyle(dateString) {
  return VISUAL_STYLES[daysSinceEpoch(dateString) % VISUAL_STYLES.length];
}

function validateDailyPacks() {
  for (const [packIndex, pack] of DAILY_PACKS.entries()) {
    assertNoMojibake(pack.caption);
    assertPortugueseAccents(pack.caption);
    for (const [slideIndex, slide] of pack.slides.entries()) {
      const text = `${slide.eyebrow}\n${slide.title}\n${slide.body}`;
      assertNoMojibake(text);
      assertPortugueseAccents(text);
    }
  }
}

function slideHtml(slide, index, total, style) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 1080px; height: 1080px; overflow: hidden; font-family: Arial, Helvetica, sans-serif; background: ${style.bgTop}; color: ${style.text}; }
    main {
      width: 1080px;
      height: 1080px;
      padding: 62px 70px 58px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background:
        linear-gradient(135deg, ${style.accentSoft}, rgba(124,255,178,0) 34%),
        linear-gradient(180deg, ${style.bgTop} 0%, ${style.bgBottom} 100%);
      position: relative;
    }
    main::before { content: ""; position: absolute; inset: 34px; border: 2px solid rgba(244,247,245,0.1); }
    main::after {
      content: "";
      position: absolute;
      right: -80px;
      top: 150px;
      width: 450px;
      height: 780px;
      background:
        linear-gradient(90deg, ${style.grid} 1px, transparent 1px),
        linear-gradient(180deg, ${style.grid} 1px, transparent 1px);
      background-size: 46px 46px;
      transform: rotate(-7deg);
    }
    section, footer { position: relative; z-index: 2; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 28px; }
    .brand { font-size: 34px; font-weight: 900; color: ${style.text}; }
    .eyebrow { font-size: 28px; font-weight: 900; color: ${style.accent}; text-transform: uppercase; text-align: right; }
    .content { display: flex; flex-direction: column; gap: 34px; }
    h1 { max-width: 850px; font-size: 82px; line-height: 1.03; font-weight: 900; color: ${style.text}; letter-spacing: 0; }
    p { max-width: 830px; font-size: 42px; line-height: 1.18; font-weight: 800; color: ${style.muted}; letter-spacing: 0; }
    .bar { width: ${index % 2 === 0 ? '148px' : '220px'}; height: 12px; background: ${style.accent}; }
    footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; color: #AEB8B2; font-size: 26px; font-weight: 800; }
    footer strong { display: block; color: ${style.text}; font-size: 30px; font-weight: 900; }
  </style>
</head>
<body>
  <main>
    <section class="top">
      <div class="brand">NerionOS</div>
      <div class="eyebrow">${slide.eyebrow}</div>
    </section>
    <section class="content">
      <div class="bar"></div>
      <h1>${slide.title}</h1>
      <p>${slide.body}</p>
    </section>
    <footer>
      <div><strong>NERION OS</strong>Skills + agentes para empresas inteligentes</div>
      <div>${index}/${total}</div>
    </footer>
  </main>
</body>
</html>`;
}

async function renderSlides(runDir, slides, style) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  const imagePaths = [];

  for (let index = 0; index < slides.length; index += 1) {
    const html = slideHtml(slides[index], index + 1, slides.length, style);
    assertNoMojibake(html);
    assertPortugueseAccents(`${slides[index].eyebrow}\n${slides[index].title}\n${slides[index].body}`);
    const htmlPath = join(runDir, `slide-${String(index + 1).padStart(2, '0')}.html`);
    const imagePath = join(runDir, `slide-${String(index + 1).padStart(2, '0')}.jpg`);
    writeFileSync(htmlPath, html, 'utf8');
    await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`);
    await page.screenshot({ path: imagePath, type: 'jpeg', quality: 94, fullPage: false });
    imagePaths.push(imagePath);
  }

  await browser.close();
  return imagePaths;
}

async function graphGet(path, params = {}) {
  const url = new URL(`${IG_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Graph GET failed [${res.status}]: ${await res.text()}`);
  return res.json();
}

async function graphPost(path, params = {}) {
  const url = new URL(`${IG_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) throw new Error(`Graph POST failed [${res.status}]: ${await res.text()}`);
  return res.json();
}

async function uploadToImgBB(imagePath, apiKey) {
  const form = new FormData();
  form.append('key', apiKey);
  form.append('image', readFileSync(resolve(imagePath)).toString('base64'));
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
  if (!res.ok) throw new Error(`imgBB upload failed [${res.status}]: ${await res.text()}`);
  const json = await res.json();
  if (!json.success) throw new Error(`imgBB upload failed: ${JSON.stringify(json)}`);
  return json.data.url;
}

async function pollContainer(containerId, token) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    const status = await graphGet(`/${containerId}`, { fields: 'status_code', access_token: token });
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR') throw new Error(`Container ${containerId} failed.`);
    await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 3000));
  }
  throw new Error(`Container ${containerId} timed out.`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.validateCopy) {
    validateDailyPacks();
    console.log(JSON.stringify({ ok: true, checkedPacks: DAILY_PACKS.length }, null, 2));
    return;
  }
  if (args.renderOnly) {
    validateDailyPacks();
    mkdirSync(RUNS_DIR, { recursive: true });
    const today = todaySaoPaulo();
    const pack = pickDailyPack(today);
    const style = pickVisualStyle(today);
    const runId = `${timestampSaoPaulo()}-render-only`;
    const runDir = join(RUNS_DIR, runId);
    mkdirSync(runDir, { recursive: true });
    writeFileSync(join(runDir, 'daily-pack.json'), JSON.stringify({ date: today, visualStyle: style.name, ...pack }, null, 2), 'utf8');
    writeFileSync(join(runDir, 'caption.txt'), pack.caption, 'utf8');
    const imagePaths = await renderSlides(runDir, pack.slides, style);
    console.log(JSON.stringify({ ok: true, renderOnly: true, runDir, visualStyle: style.name, imagePaths }, null, 2));
    return;
  }
  const env = loadEnv();
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  const userId = env.INSTAGRAM_USER_ID;
  const imgbbKey = env.IMGBB_API_KEY;
  if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN ausente.');
  if (!userId) throw new Error('INSTAGRAM_USER_ID ausente.');
  if (!imgbbKey) throw new Error('IMGBB_API_KEY ausente.');

  const today = todaySaoPaulo();
  const pack = pickDailyPack(today);
  const style = pickVisualStyle(today);
  const { slides, caption } = pack;

  assertNoMojibake(caption);
  assertPortugueseAccents(caption);
  mkdirSync(RUNS_DIR, { recursive: true });
  const runId = timestampSaoPaulo();
  const runDir = join(RUNS_DIR, runId);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, 'daily-pack.json'), JSON.stringify({ date: today, visualStyle: style.name, ...pack }, null, 2), 'utf8');
  writeFileSync(join(runDir, 'caption.txt'), caption, 'utf8');

  const account = await graphGet(`/${userId}`, { fields: 'id,username', access_token: token });
  if (account.username !== EXPECTED_USERNAME) {
    throw new Error(`Conta errada: esperado ${EXPECTED_USERNAME}, retornou ${account.username}.`);
  }

  const imagePaths = await renderSlides(runDir, slides, style);
  const imageUrls = await Promise.all(imagePaths.map((imagePath) => uploadToImgBB(imagePath, imgbbKey)));
  const children = await Promise.all(
    imageUrls.map((imageUrl) => graphPost(`/${userId}/media`, {
      image_url: imageUrl,
      is_carousel_item: 'true',
      access_token: token
    }))
  );
  const childIds = children.map((child) => child.id);
  await Promise.all(childIds.map((childId) => pollContainer(childId, token)));

  const carousel = await graphPost(`/${userId}/media`, {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
    access_token: token
  });
  await pollContainer(carousel.id, token);

  const baseResult = {
    ok: true,
    dryRun: args.dryRun,
    date: today,
    runId,
    visualStyle: style.name,
    account: account.username,
    runDir,
    imagePaths,
    imageUrls,
    childIds,
    carouselId: carousel.id
  };

  if (args.dryRun) {
    writeFileSync(join(runDir, 'result.json'), JSON.stringify(baseResult, null, 2), 'utf8');
    console.log(JSON.stringify(baseResult, null, 2));
    return;
  }

  const media = await graphPost(`/${userId}/media_publish`, {
    creation_id: carousel.id,
    access_token: token
  });
  const details = await graphGet(`/${media.id}`, {
    fields: 'id,permalink,timestamp',
    access_token: token
  });
  const result = { ...baseResult, mediaId: media.id, ...details };
  writeFileSync(join(runDir, 'result.json'), JSON.stringify(result, null, 2), 'utf8');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  const failure = { ok: false, error: error.message, timestamp: new Date().toISOString() };
  mkdirSync(RUNS_DIR, { recursive: true });
  writeFileSync(join(RUNS_DIR, `failure-${timestampSaoPaulo()}.json`), JSON.stringify(failure, null, 2), 'utf8');
  console.error(error.message);
  process.exit(1);
});
