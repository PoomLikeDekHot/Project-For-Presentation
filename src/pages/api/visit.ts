import type { APIRoute } from 'astro';

// endpoint นี้ต้องรันฝั่ง server (ไม่ prerender) เพื่อซ่อน Webhook URL ไว้ใน env
export const prerender = false;

interface VisitPayload {
  path?: string;
  referrer?: string;
  screen?: string;
  language?: string;
}

/** อ่าน env ได้ทั้งบน Cloudflare (locals.runtime.env) และตอน dev (import.meta.env) */
function readWebhookUrl(locals: App.Locals): string | undefined {
  const fromRuntime = (locals as any)?.runtime?.env?.DISCORD_WEBHOOK_URL;
  return fromRuntime ?? import.meta.env.DISCORD_WEBHOOK_URL;
}

function deviceFromUA(ua: string): string {
  if (/mobile|iphone|android.+mobile/i.test(ua)) return 'มือถือ';
  if (/ipad|tablet/i.test(ua)) return 'แท็บเล็ต';
  if (/macintosh|windows|linux/i.test(ua)) return 'คอมพิวเตอร์';
  return 'ไม่ทราบ';
}

function browserFromUA(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua)) return 'Safari';
  return 'อื่นๆ';
}

export const POST: APIRoute = async ({ request, locals }) => {
  const webhookUrl = readWebhookUrl(locals);
  if (!webhookUrl) {
    return new Response(JSON.stringify({ ok: false, error: 'no webhook configured' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: VisitPayload = {};
  try {
    body = await request.json();
  } catch {
    /* เผื่อ body ว่าง */
  }

  const ua = request.headers.get('user-agent') ?? '';
  const country = request.headers.get('cf-ipcountry') ?? '—';
  const now = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const referrer = body.referrer && body.referrer.trim() !== '' ? body.referrer : 'เข้าตรง (ไม่มีที่มา)';
  const path = body.path || '/';

  // ── Embed สไตล์ขาวดำ มินิมอลตามธีมเว็บ (พื้นดำ ขอบขาว) ──
  const embed = {
    author: { name: 'PHUM · PORTFOLIO' },
    title: '◍  มีผู้เข้าชมเว็บไซต์',
    description: '```\nA new visitor just landed.\n```',
    color: 0xffffff, // ขอบซ้ายสีขาว = โทนขาวดำ
    fields: [
      { name: '› หน้า', value: '`' + path + '`', inline: true },
      { name: '› อุปกรณ์', value: deviceFromUA(ua), inline: true },
      { name: '› เบราว์เซอร์', value: browserFromUA(ua), inline: true },
      { name: '› ประเทศ', value: country, inline: true },
      { name: '› เวลา', value: now + ' น.', inline: true },
      { name: '› ที่มา', value: referrer, inline: false },
    ],
    footer: { text: 'phum-portfolio · live tracking' },
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'Portfolio',
      embeds: [embed],
    }),
  });

  return new Response(JSON.stringify({ ok: res.ok }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
