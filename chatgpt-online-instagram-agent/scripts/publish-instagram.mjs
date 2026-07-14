#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const IG_BASE = 'https://graph.facebook.com/v21.0';

function parseArgs(argv) {
  const args = {
    image: '',
    images: '',
    captionFile: '',
    type: 'story',
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--image' && i + 1 < argv.length) args.image = argv[++i];
    else if (argv[i] === '--images' && i + 1 < argv.length) args.images = argv[++i];
    else if (argv[i] === '--caption-file' && i + 1 < argv.length) args.captionFile = argv[++i];
    else if (argv[i] === '--type' && i + 1 < argv.length) args.type = argv[++i];
    else if (argv[i] === '--dry-run') args.dryRun = true;
  }

  return args;
}

function assertNoMojibake(text) {
  const markers = ['Ã', 'Â', 'â', '�', 'nÃ', 'FlorianÃ', 'operaÃ', 'decisÃ', 'conteÃ'];
  const found = markers.find((marker) => text.includes(marker));
  if (found) {
    throw new Error(`Text contains mojibake marker "${found}". Fix PT-BR accents before publishing.`);
  }
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
    const status = await graphGet(`/${containerId}`, {
      fields: 'status_code',
      access_token: token,
    });
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR') throw new Error(`Container ${containerId} failed.`);
    await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 3000));
  }
  throw new Error(`Container ${containerId} timed out.`);
}

async function main() {
  const args = parseArgs(process.argv);
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const imgbbKey = process.env.IMGBB_API_KEY;
  const expectedUsername = process.env.TARGET_INSTAGRAM_USERNAME || 'marcondes.machado.oficial';

  if (!token) throw new Error('Missing INSTAGRAM_ACCESS_TOKEN.');
  if (!userId) throw new Error('Missing INSTAGRAM_USER_ID.');
  if (!imgbbKey) throw new Error('Missing IMGBB_API_KEY.');

  const account = await graphGet(`/${userId}`, {
    fields: 'id,username',
    access_token: token,
  });
  if (account.username !== expectedUsername) {
    throw new Error(`Wrong Instagram account: expected ${expectedUsername}, got ${account.username}.`);
  }

  const caption = args.captionFile ? readFileSync(resolve(args.captionFile), 'utf8').trim() : '';
  if (caption) assertNoMojibake(caption);

  if (args.type === 'story') {
    if (!args.image) throw new Error('Story requires --image.');
    const imageUrl = await uploadToImgBB(args.image, imgbbKey);
    const container = await graphPost(`/${userId}/media`, {
      media_type: 'STORIES',
      image_url: imageUrl,
      access_token: token,
    });
    await pollContainer(container.id, token);
    if (args.dryRun) {
      console.log(JSON.stringify({ ok: true, dryRun: true, account: account.username, containerId: container.id, imageUrl }, null, 2));
      return;
    }
    const media = await graphPost(`/${userId}/media_publish`, {
      creation_id: container.id,
      access_token: token,
    });
    const details = await graphGet(`/${media.id}`, {
      fields: 'id,permalink,timestamp',
      access_token: token,
    });
    console.log(JSON.stringify({ ok: true, type: 'story', account: account.username, mediaId: media.id, ...details }, null, 2));
    return;
  }

  throw new Error('This base script currently implements story publishing. Extend carousel publishing from the existing project script if needed.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

