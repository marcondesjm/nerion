#!/usr/bin/env node
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const AUTO_DIR = resolve(ROOT, 'automation', 'instagram-autopost');
const RUNS_DIR = join(AUTO_DIR, 'runs');
const STATE_PATH = join(AUTO_DIR, 'state.json');
const IG_BASE = 'https://graph.facebook.com/v21.0';
const EXPECTED_USERNAME = 'marcondes.machado.oficial';

const THEMES = [
  {
    hook: 'Prompt ajuda uma pessoa.',
    accent: 'Skill ajuda o time inteiro.',
    body: 'Quando o processo fica documentado, a IA deixa de ser improviso e vira operação repetível.',
    chips: ['processo claro', 'agente treinado', 'resultado repetível'],
    cta: 'Comente IA ou chame no direct para mapear o primeiro agente da sua operação.'
  },
  {
    hook: 'Automação sem processo',
    accent: 'vira bagunça mais rápida.',
    body: 'Antes de automatizar, desenhe o fluxo: entrada, decisão, ferramenta, saída e critério de qualidade.',
    chips: ['fluxo', 'critério', 'execução'],
    cta: 'Quer aplicar IA com segurança? Comece por uma rotina que consome tempo demais.'
  },
  {
    hook: 'IA solta não escala.',
    accent: 'Agentes com processo, sim.',
    body: 'No Nerion OS, a IA entra em discovery, atendimento, comercial, suporte, conteúdo e decisão.',
    chips: ['skills', 'agentes', 'operação'],
    cta: 'Comente IA e vamos desenhar o primeiro agente da sua empresa.'
  },
  {
    hook: 'Seu time não precisa',
    accent: 'de mais uma aba aberta.',
    body: 'Precisa de agentes que entendem contexto, seguem um método e entregam com padrão.',
    chips: ['contexto', 'método', 'padrão'],
    cta: 'Chame no direct para transformar uma rotina em agente.'
  },
  {
    hook: 'Empresas inteligentes',
    accent: 'não usam IA no improviso.',
    body: 'Elas conectam dados, processos e agentes para reduzir retrabalho e acelerar decisões.',
    chips: ['menos retrabalho', 'mais clareza', 'decisão rápida'],
    cta: 'Comente IA para mapear uma automação útil para sua operação.'
  }
];

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    force: argv.includes('--force')
  };
}

function loadEnv() {
  const envPath = join(ROOT, '.env');
  const env = { ...process.env };
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, 'utf8').replace(/^\uFEFF/, '');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([^#][^=]+)=(.*)$/);
      if (match && !env[match[1].trim()]) env[match[1].trim()] = match[2].trim();
    }
  }
  return env;
}

function assertNoMojibake(text) {
  const markers = ['Ã', 'Â', 'â', '�', 'nÃ', 'FlorianÃ', 'operaÃ', 'decisÃ', 'conteÃ'];
  const found = markers.find((marker) => text.includes(marker));
  if (found) throw new Error(`Texto contém mojibake (${found}). Corrija antes de publicar.`);
}

function todaySaoPaulo() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function runStamp() {
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

function loadState() {
  if (!existsSync(STATE_PATH)) return {};
  return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
}

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function pickTheme(dateString) {
  const seed = [...dateString].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return THEMES[seed % THEMES.length];
}

function storyHtml(theme) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { width: 1080px; height: 1920px; overflow: hidden; font-family: Arial, Helvetica, sans-serif; background: #0B1014; color: #F4F7F5; }
    .story {
      width: 1080px;
      height: 1920px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 96px 76px 92px;
      background:
        linear-gradient(155deg, rgba(124,255,178,0.18), rgba(124,255,178,0) 34%),
        linear-gradient(180deg, #0B1014 0%, #111A20 100%);
      position: relative;
    }
    .story::before { content: ""; position: absolute; inset: 38px; border: 2px solid rgba(244,247,245,0.09); }
    .story::after {
      content: "";
      position: absolute;
      right: -170px;
      top: 260px;
      width: 520px;
      height: 1180px;
      background:
        linear-gradient(90deg, rgba(124,255,178,0.12) 1px, transparent 1px),
        linear-gradient(180deg, rgba(124,255,178,0.11) 1px, transparent 1px);
      background-size: 58px 58px;
      transform: rotate(-8deg);
      opacity: 0.95;
    }
    .top, .content, .footer { position: relative; z-index: 2; }
    .top { display: flex; align-items: flex-start; justify-content: space-between; gap: 36px; }
    .brand { font-size: 34px; line-height: 1; font-weight: 900; color: #F4F7F5; }
    .tag { max-width: 500px; text-align: right; font-size: 28px; line-height: 1.24; font-weight: 900; color: #7CFFB2; text-transform: uppercase; }
    .content { display: flex; flex-direction: column; gap: 34px; padding: 90px 0 40px; }
    h1 { max-width: 900px; font-size: 92px; line-height: 1.03; font-weight: 900; color: #F4F7F5; }
    .accent { max-width: 880px; font-size: 72px; line-height: 1.08; font-weight: 900; color: #7CFFB2; }
    .body { max-width: 850px; font-size: 43px; line-height: 1.24; font-weight: 700; color: #DDE5DF; }
    .chips { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; max-width: 820px; }
    .chip { width: fit-content; min-width: 320px; font-size: 36px; line-height: 1.1; font-weight: 900; color: #0B1014; background: #7CFFB2; padding: 20px 28px; border-radius: 8px; }
    .cta { margin-top: 22px; max-width: 870px; font-size: 42px; line-height: 1.18; font-weight: 900; color: #F4F7F5; background: rgba(244,247,245,0.08); border-left: 12px solid #7CFFB2; padding: 30px 34px; }
    .footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; font-size: 28px; line-height: 1.22; font-weight: 800; color: #AEB8B2; }
    .footer strong { display: block; color: #F4F7F5; font-size: 34px; font-weight: 900; }
    .footer .right { text-align: right; max-width: 450px; }
  </style>
</head>
<body>
  <main class="story">
    <section class="top">
      <div class="brand">NerionOS</div>
      <div class="tag">IA aplicada à operação</div>
    </section>
    <section class="content">
      <h1>${theme.hook}</h1>
      <div class="accent">${theme.accent}</div>
      <p class="body">${theme.body}</p>
      <div class="chips">${theme.chips.map((chip) => `<div class="chip">${chip}</div>`).join('')}</div>
      <div class="cta">${theme.cta}</div>
    </section>
    <section class="footer">
      <div><strong>NERION OS</strong>Skills + agentes para empresas inteligentes</div>
      <div class="right">@marcondes.machado.oficial</div>
    </section>
  </main>
</body>
</html>`;
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
  const fileBuffer = readFileSync(resolve(imagePath));
  const form = new FormData();
  form.append('key', apiKey);
  form.append('image', fileBuffer.toString('base64'));
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

async function renderStory(htmlPath, imagePath, html) {
  writeFileSync(htmlPath, html, 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`);
  await page.screenshot({ path: imagePath, type: 'jpeg', quality: 94, fullPage: false });
  await browser.close();
}

async function main() {
  const args = parseArgs(process.argv);
  if (process.env.AUTOPOST_ALLOW_INSECURE_TLS === '1') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const env = loadEnv();
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  const userId = env.INSTAGRAM_USER_ID;
  const imgbbKey = env.IMGBB_API_KEY;
  if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN ausente no .env.');
  if (!userId) throw new Error('INSTAGRAM_USER_ID ausente no .env.');
  if (!imgbbKey) throw new Error('IMGBB_API_KEY ausente no .env.');

  const today = todaySaoPaulo();
  const state = loadState();
  if (!args.force && !args.dryRun && state.lastPublishedDate === today) {
    console.log(JSON.stringify({ ok: true, skipped: true, reason: 'already_published_today', date: today }, null, 2));
    return;
  }

  mkdirSync(RUNS_DIR, { recursive: true });
  const runId = runStamp();
  const runDir = join(RUNS_DIR, runId);
  mkdirSync(runDir, { recursive: true });

  const theme = pickTheme(today);
  const html = storyHtml(theme);
  assertNoMojibake(html);

  const storyPath = join(runDir, 'story.jpg');
  const htmlPath = join(runDir, 'story.html');
  const resultPath = join(runDir, 'result.json');
  await renderStory(htmlPath, storyPath, html);

  const account = await graphGet(`/${userId}`, { fields: 'id,username', access_token: token });
  if (account.username !== EXPECTED_USERNAME) {
    throw new Error(`Conta errada: esperado ${EXPECTED_USERNAME}, retornou ${account.username}.`);
  }

  const imageUrl = await uploadToImgBB(storyPath, imgbbKey);
  const container = await graphPost(`/${userId}/media`, {
    media_type: 'STORIES',
    image_url: imageUrl,
    access_token: token
  });
  await pollContainer(container.id, token);

  const baseResult = {
    ok: true,
    dryRun: args.dryRun,
    date: today,
    runId,
    account: account.username,
    storyPath,
    imageUrl,
    containerId: container.id,
    theme
  };

  if (args.dryRun) {
    writeFileSync(resultPath, JSON.stringify(baseResult, null, 2), 'utf8');
    console.log(JSON.stringify(baseResult, null, 2));
    return;
  }

  const media = await graphPost(`/${userId}/media_publish`, {
    creation_id: container.id,
    access_token: token
  });
  const details = await graphGet(`/${media.id}`, {
    fields: 'id,permalink,timestamp',
    access_token: token
  });

  const result = { ...baseResult, mediaId: media.id, ...details };
  state.lastPublishedDate = today;
  state.lastResult = result;
  saveState(state);
  writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  const failure = { ok: false, error: error.message, timestamp: new Date().toISOString() };
  mkdirSync(RUNS_DIR, { recursive: true });
  writeFileSync(join(RUNS_DIR, `failure-${runStamp()}.json`), JSON.stringify(failure, null, 2), 'utf8');
  console.error(error.message);
  process.exit(1);
});
