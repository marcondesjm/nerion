const STORY_CRON = "0 12 * * *";
const FEED_CRON = "10 12 * * *";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

async function dispatchWorkflow(env, workflow, inputs = {}) {
  if (!env.GITHUB_TOKEN) {
    throw new Error("Missing Cloudflare secret GITHUB_TOKEN.");
  }

  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/${workflow}/dispatches`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "nerion-instagram-cron",
      "x-github-api-version": "2022-11-28"
    },
    body: JSON.stringify({
      ref: env.GITHUB_REF || "main",
      inputs
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub dispatch failed for ${workflow}: ${response.status} ${errorText}`);
  }

  return { workflow, status: response.status };
}

async function runForCron(cron, env) {
  if (cron === STORY_CRON) {
    return [
      await dispatchWorkflow(env, env.STORY_WORKFLOW, {
        dry_run: "false",
        force: "true"
      })
    ];
  }

  if (cron === FEED_CRON) {
    return [
      await dispatchWorkflow(env, env.FEED_WORKFLOW, {
        dry_run: "false"
      })
    ];
  }

  return [
    await dispatchWorkflow(env, env.STORY_WORKFLOW, {
      dry_run: "false",
      force: "true"
    }),
    await dispatchWorkflow(env, env.FEED_WORKFLOW, {
      dry_run: "false"
    })
  ];
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runForCron(event.cron, env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return jsonResponse({
        ok: true,
        service: "nerion-instagram-cron",
        storyCron: STORY_CRON,
        feedCron: FEED_CRON
      });
    }

    if (url.pathname === "/test") {
      const secret = url.searchParams.get("secret");
      if (!env.TEST_SECRET || secret !== env.TEST_SECRET) {
        return jsonResponse({ ok: false, error: "unauthorized" }, 401);
      }
      const results = await runForCron("manual-test", env);
      return jsonResponse({ ok: true, results });
    }

    return jsonResponse({ ok: true, message: "Nerion Instagram cron is active." });
  }
};
