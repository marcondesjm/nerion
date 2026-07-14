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

const slides = [
  {
    eyebrow: 'Nerion OS',
    title: 'IA solta não escala.',
    body: 'Quando cada pessoa usa IA de um jeito, o resultado vira improviso.'
  },
  {
    eyebrow: 'O salto real',
    title: 'Agentes com processo, sim.',
    body: 'A empresa ganha quando transforma tarefas repetidas em fluxos claros, medidos e treináveis.'
  },
  {
    eyebrow: 'Na prática',
    title: 'Skill é o manual vivo.',
    body: 'Ela documenta contexto, padrão de qualidade, entrada, saída e modo de execução.'
  },
  {
    eyebrow: 'Operação inteligente',
    title: 'Agente executa com padrão.',
    body: 'Atendimento, comercial, suporte, conteúdo e decisão podem ganhar velocidade sem perder controle.'
  },
  {
    eyebrow: 'Florianópolis',
    title: 'Comece por um processo.',
    body: 'Escolha uma rotina que consome tempo demais. A NerionOS desenha o fluxo, cria a skill e coloca o agente para trabalhar.'
  }
];

const caption = `IA solta não escala. Agentes com processo, sim.

Em Florianópolis, a conversa sobre IA já amadureceu: não basta testar uma ferramenta nova e chamar isso de transformação.

O ponto real é outro:
onde a IA reduz retrabalho?
onde acelera uma decisão?
onde melhora atendimento, comercial, suporte ou conteúdo?
onde cria padrão para o time inteiro operar melhor?

No Nerion OS, a IA entra como sistema de operação:
skills documentadas,
agentes especializados,
fluxos conectados,
critérios de qualidade,
e uma rotina que pode ser repetida.

Porque prompt sozinho ajuda uma pessoa.
Processo com agente ajuda a empresa.

Se sua empresa em Florianópolis quer usar IA de forma prática, comece por um processo que hoje consome tempo demais.

A NerionOS desenha o fluxo, cria a skill e coloca o agente para trabalhar.

Comente IA ou chame no direct para mapear o primeiro agente da sua operação.

#nerionos #inteligenciaartificial #florianopolis #floripatech #agentesia #automacao #saas #productdesign #uxdesign #negociosdigitais #inovacao #santacatarina`;

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
  const markers = ['Ã', 'Â', 'â€', 'ï¿½', '�'];
  const found = markers.find((marker) => text.includes(marker));
  if (found) throw new Error(`Texto contém mojibake (${found}). Corrija antes de publicar.`);
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
    h1 { max-width: 850px; font-size: 82px; line-height: 1.03; font-weight: 900; color: #F4F7F5; }
    p { max-width: 830px; font-size: 42px; line-height: 1.18; font-weight: 800; color: #DDE5DF; }
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

async function renderSlides(runDir) {
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

  assertNoMojibake(caption);
  mkdirSync(RUNS_DIR, { recursive: true });
  const runId = timestampSaoPaulo();
  const runDir = join(RUNS_DIR, runId);
  mkdirSync(runDir, { recursive: true });
  writeFileSync(join(runDir, 'caption.txt'), caption, 'utf8');

  const account = await graphGet(`/${userId}`, { fields: 'id,username', access_token: token });
  if (account.username !== EXPECTED_USERNAME) {
    throw new Error(`Conta errada: esperado ${EXPECTED_USERNAME}, retornou ${account.username}.`);
  }

  const imagePaths = await renderSlides(runDir);
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
