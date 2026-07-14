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
      { eyebrow: 'Nerion OS', title: 'IA solta nao escala.', body: 'Quando cada pessoa usa IA de um jeito, o resultado vira improviso.' },
      { eyebrow: 'O salto real', title: 'Agentes com processo, sim.', body: 'A empresa ganha quando transforma tarefas repetidas em fluxos claros, medidos e treinaveis.' },
      { eyebrow: 'Na pratica', title: 'Skill e o manual vivo.', body: 'Ela documenta contexto, padrao de qualidade, entrada, saida e modo de execucao.' },
      { eyebrow: 'Operacao inteligente', title: 'Agente executa com padrao.', body: 'Atendimento, comercial, suporte, conteudo e decisao ganham velocidade sem perder controle.' },
      { eyebrow: 'Comece pequeno', title: 'Escolha um processo.', body: 'A NerionOS desenha o fluxo, cria a skill e coloca o agente para trabalhar.' }
    ],
    caption: `IA solta nao escala. Agentes com processo, sim.

O ponto real nao e testar ferramenta nova. E descobrir onde a IA reduz retrabalho, acelera decisao e cria padrao para o time inteiro operar melhor.

No NerionOS, a IA entra como sistema de operacao: skills documentadas, agentes especializados, fluxos conectados e criterios de qualidade.

Prompt sozinho ajuda uma pessoa. Processo com agente ajuda a empresa.

Comente IA ou chame no direct para mapear o primeiro agente da sua operacao.

#nerionos #inteligenciaartificial #agentesia #automacao #negociosdigitais #inovacao #empresasinteligentes`
  },
  {
    slides: [
      { eyebrow: 'Skill', title: 'Conhecimento precisa virar rotina.', body: 'Se o padrao fica so na cabeca de uma pessoa, a empresa perde velocidade.' },
      { eyebrow: 'Contexto', title: 'A skill guarda o jeito certo.', body: 'Ela registra criterio, tom, dados, limites e exemplos para o agente executar melhor.' },
      { eyebrow: 'Agente', title: 'Execucao sem recomecar do zero.', body: 'Cada tarefa parte de um protocolo claro, nao de improviso.' },
      { eyebrow: 'Gestao', title: 'Menos dependencia individual.', body: 'O time ganha consistencia porque o conhecimento fica operacionalizado.' },
      { eyebrow: 'NerionOS', title: 'Transforme know-how em sistema.', body: 'Mapeie um processo, escreva a skill e coloque um agente para rodar.' }
    ],
    caption: `Toda empresa tem conhecimento importante preso em conversas, planilhas e pessoas-chave.

Skills resolvem isso: transformam contexto, criterio e padrao de qualidade em uma rotina que agentes conseguem executar.

Quando a skill fica clara, o agente nao improvisa. Ele segue um jeito de trabalhar que pode ser revisado, melhorado e repetido.

Esse e o caminho pratico para IA em empresas: menos dependencia individual, mais operacao inteligente.

#skills #agentesia #nerionos #inteligenciaartificial #automacao #gestao #produtividade`
  },
  {
    slides: [
      { eyebrow: 'Atendimento', title: 'IA nao e so chatbot.', body: 'O valor aparece quando o atendimento entende contexto, prioridade e proximo passo.' },
      { eyebrow: 'Skill', title: 'Padrao antes da resposta.', body: 'A skill define tom, politicas, perguntas obrigatorias e criterios de encaminhamento.' },
      { eyebrow: 'Agente', title: 'Resolucao com trilha.', body: 'O agente coleta dados, classifica, responde e aciona o fluxo certo.' },
      { eyebrow: 'Empresa', title: 'Menos fila, mais clareza.', body: 'O time humano recebe casos melhor organizados, com historico e recomendacao.' },
      { eyebrow: 'NerionOS', title: 'Atendimento vira operacao.', body: 'A IA trabalha dentro de um processo, nao solta em uma caixa de mensagem.' }
    ],
    caption: `IA em atendimento nao deveria ser apenas um chatbot respondendo rapido.

O ganho real vem quando existe processo: skill com criterios, agente com papel claro e fluxo conectado ao time humano.

Assim a IA coleta informacoes, classifica urgencia, responde com padrao e encaminha o que precisa de decisao.

Velocidade com controle. Automacao com contexto.

#atendimento #inteligenciaartificial #agentesia #nerionos #automacao #experienciadocliente`
  },
  {
    slides: [
      { eyebrow: 'Comercial', title: 'Lead bom nao pode esfriar.', body: 'A velocidade entre interesse e resposta muda o resultado da venda.' },
      { eyebrow: 'Agente', title: 'Triagem em minutos.', body: 'O agente identifica perfil, dor, urgencia e melhor proxima acao.' },
      { eyebrow: 'Skill', title: 'Discurso comercial com padrao.', body: 'A skill guarda oferta, objecoes, tom, perguntas e criterios de qualificacao.' },
      { eyebrow: 'Pipeline', title: 'Menos follow-up perdido.', body: 'A automacao lembra, organiza e prepara o vendedor para entrar no momento certo.' },
      { eyebrow: 'NerionOS', title: 'Venda com IA operacional.', body: 'Nao e sobre substituir o comercial. E dar sistema para ele vender melhor.' }
    ],
    caption: `No comercial, IA boa nao e a que fala bonito. E a que reduz atraso, organiza contexto e ajuda o time a agir no momento certo.

Com skills, o agente aprende o padrao da oferta, as perguntas de qualificacao e os criterios de prioridade.

Com fluxo, ele registra dados, prepara follow-ups e entrega uma proxima acao clara.

IA em empresas precisa aparecer no pipeline, nao apenas em ideias.

#vendas #crm #agentesia #nerionos #automacao #inteligenciaartificial #negocios`
  },
  {
    slides: [
      { eyebrow: 'Conteudo', title: 'Post diario tambem precisa de sistema.', body: 'Criatividade melhora quando existe pauta, criterio e rotina.' },
      { eyebrow: 'Skill', title: 'A marca ganha memoria.', body: 'Tom de voz, temas, proibicoes, exemplos e formatos ficam documentados.' },
      { eyebrow: 'Agente', title: 'Execucao com variacao.', body: 'O agente cria novas abordagens sem fugir do posicionamento.' },
      { eyebrow: 'Operacao', title: 'Publicar deixa de ser improviso.', body: 'Roteiro, arte, legenda e revisao entram em uma esteira previsivel.' },
      { eyebrow: 'NerionOS', title: 'Marketing com agentes.', body: 'Menos branco na tela. Mais consistencia para construir autoridade.' }
    ],
    caption: `Conteudo diario nao precisa depender de inspiracao aleatoria.

Com uma skill bem feita, a marca ganha memoria: tom de voz, temas, exemplos, criterios de qualidade e limites.

Com agentes, a operacao cria novas abordagens sem perder consistencia.

Esse e o uso pratico de IA no marketing: transformar conteudo em sistema.

#marketingdigital #conteudo #agentesia #skills #nerionos #automacao #inteligenciaartificial`
  },
  {
    slides: [
      { eyebrow: 'Operacao', title: 'O gargalo nem sempre e falta de gente.', body: 'Muitas vezes e falta de fluxo claro para tarefas repetidas.' },
      { eyebrow: 'Diagnostico', title: 'Mapeie a rotina cansativa.', body: 'Procure onde o time copia, cola, confere, reescreve e cobra status.' },
      { eyebrow: 'Skill', title: 'Defina o padrao.', body: 'Entrada, saida, criterio, excecao e exemplos viram instrucao operacional.' },
      { eyebrow: 'Agente', title: 'Rode a rotina.', body: 'O agente executa, registra resultado e chama humanos quando precisa.' },
      { eyebrow: 'NerionOS', title: 'Automacao com governanca.', body: 'IA boa nao bagunca a empresa. Ela organiza o trabalho.' }
    ],
    caption: `Antes de automatizar, escolha a rotina certa.

O melhor primeiro agente geralmente nasce onde existe repeticao: copiar dados, conferir informacao, responder padrao, atualizar status, preparar material.

A skill define o padrao. O agente executa. O fluxo registra e mede.

IA em empresas precisa reduzir atrito operacional todos os dias.

#operacao #automacao #iaempresas #agentesia #skills #nerionos #produtividade`
  },
  {
    slides: [
      { eyebrow: 'Gestao', title: 'IA precisa de criterio.', body: 'Sem criterio, a empresa ganha velocidade para errar mais rapido.' },
      { eyebrow: 'Qualidade', title: 'Defina o que e bom.', body: 'A skill registra padroes, exemplos aprovados e sinais de alerta.' },
      { eyebrow: 'Agente', title: 'Execute com verificacao.', body: 'O agente produz, checa requisitos e separa excecoes para revisao.' },
      { eyebrow: 'Aprendizado', title: 'Melhore a cada rodada.', body: 'Feedback vira ajuste de skill, nao apenas correcao manual.' },
      { eyebrow: 'NerionOS', title: 'IA como sistema vivo.', body: 'Agentes melhores nascem de processos que aprendem.' }
    ],
    caption: `A pergunta nao e apenas: "qual IA vamos usar?"

A pergunta mais importante e: "qual criterio essa IA precisa seguir para ajudar a empresa com seguranca?"

Skills tornam esse criterio explicito. Agentes executam com verificacao. Feedback melhora o sistema.

E assim a IA sai do teste isolado e vira operacao viva.

#gestao #qualidade #inteligenciaartificial #agentesia #skills #nerionos #empresas`
  }
];

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run')
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

function pickDailyPack(dateString) {
  const seed = [...dateString].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return DAILY_PACKS[seed % DAILY_PACKS.length];
}

function slideHtml(slide, index, total) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 1080px; height: 1080px; overflow: hidden; font-family: Arial, Helvetica, sans-serif; background: #0B1014; color: #F4F7F5; }
    main {
      width: 1080px;
      height: 1080px;
      padding: 62px 70px 58px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background:
        linear-gradient(135deg, rgba(124,255,178,0.18), rgba(124,255,178,0) 34%),
        linear-gradient(180deg, #0B1014 0%, #121A20 100%);
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
        linear-gradient(90deg, rgba(124,255,178,0.10) 1px, transparent 1px),
        linear-gradient(180deg, rgba(124,255,178,0.10) 1px, transparent 1px);
      background-size: 46px 46px;
      transform: rotate(-7deg);
    }
    section, footer { position: relative; z-index: 2; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 28px; }
    .brand { font-size: 34px; font-weight: 900; color: #F4F7F5; }
    .eyebrow { font-size: 28px; font-weight: 900; color: #7CFFB2; text-transform: uppercase; text-align: right; }
    .content { display: flex; flex-direction: column; gap: 34px; }
    h1 { max-width: 850px; font-size: 82px; line-height: 1.03; font-weight: 900; color: #F4F7F5; letter-spacing: 0; }
    p { max-width: 830px; font-size: 42px; line-height: 1.18; font-weight: 800; color: #DDE5DF; letter-spacing: 0; }
    .bar { width: 220px; height: 12px; background: #7CFFB2; }
    footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; color: #AEB8B2; font-size: 26px; font-weight: 800; }
    footer strong { display: block; color: #F4F7F5; font-size: 30px; font-weight: 900; }
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

async function renderSlides(runDir, slides) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  const imagePaths = [];

  for (let index = 0; index < slides.length; index += 1) {
    const html = slideHtml(slides[index], index + 1, slides.length);
    assertNoMojibake(html);
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
  const env = loadEnv();
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  const userId = env.INSTAGRAM_USER_ID;
  const imgbbKey = env.IMGBB_API_KEY;
  if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN ausente.');
  if (!userId) throw new Error('INSTAGRAM_USER_ID ausente.');
  if (!imgbbKey) throw new Error('IMGBB_API_KEY ausente.');

  const today = todaySaoPaulo();
  const pack = pickDailyPack(today);
  const { slides, caption } = pack;

  assertNoMojibake(caption);
  mkdirSync(RUNS_DIR, { recursive: true });
  const runId = timestampSaoPaulo();
  const runDir = join(RUNS_DIR, runId);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, 'daily-pack.json'), JSON.stringify({ date: today, ...pack }, null, 2), 'utf8');
  writeFileSync(join(runDir, 'caption.txt'), caption, 'utf8');

  const account = await graphGet(`/${userId}`, { fields: 'id,username', access_token: token });
  if (account.username !== EXPECTED_USERNAME) {
    throw new Error(`Conta errada: esperado ${EXPECTED_USERNAME}, retornou ${account.username}.`);
  }

  const imagePaths = await renderSlides(runDir, slides);
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
