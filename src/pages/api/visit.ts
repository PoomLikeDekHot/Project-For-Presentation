import type { APIRoute } from 'astro';

// endpoint นี้ต้องรันฝั่ง server (ไม่ prerender) เพื่อซ่อน Webhook URL ไว้ใน env
export const prerender = false;

interface VisitPayload {
  path?: string;
  referrer?: string;
  screen?: string;
  language?: string;
  firstVisit?: boolean;
}

/** อ่าน env ได้ทั้งบน Cloudflare (locals.runtime.env) และตอน dev (import.meta.env) */
function readEnv(locals: App.Locals, key: string): string | undefined {
  return (locals as any)?.runtime?.env?.[key] ?? (import.meta.env as any)[key];
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

/** แปลง referrer ยาวๆ เป็นชื่อแหล่งที่มาแบบอ่านง่าย */
function sourceLabel(ref?: string): string {
  if (!ref || !ref.trim()) return 'เข้าตรง';
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '').toLowerCase();
    const map: [RegExp, string][] = [
      [/google\./, 'Google'],
      [/(facebook\.|fb\.)/, 'Facebook'],
      [/instagram\./, 'Instagram'],
      [/(t\.co|twitter\.|x\.com)/, 'X'],
      [/linkedin\./, 'LinkedIn'],
      [/youtube\.|youtu\.be/, 'YouTube'],
      [/tiktok\./, 'TikTok'],
      [/github\./, 'GitHub'],
      [/bing\./, 'Bing'],
      [/reddit\./, 'Reddit'],
      [/(line\.me|liff)/, 'LINE'],
    ];
    for (const [re, name] of map) if (re.test(h)) return name;
    return h;
  } catch {
    return 'เข้าตรง';
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  // รองรับชื่อ env ทั้ง DISCORD_WEBHOOK_URL และ Webhook (ที่ตั้งไว้บน Cloudflare)
  const webhookUrl = readEnv(locals, 'DISCORD_WEBHOOK_URL') || readEnv(locals, 'Webhook');
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
  const path = body.path || '/';
  const isFirst = body.firstVisit === true;

  const fmt = (opt: Intl.DateTimeFormatOptions) =>
    new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', ...opt });
  const time = fmt({ hour: '2-digit', minute: '2-digit' });
  const date = fmt({ day: 'numeric', month: 'short', year: 'numeric' });

  const origin = new URL(request.url).origin;
  const host = new URL(request.url).host;
  const avatar = readEnv(locals, 'VISITOR_AVATAR_URL') || `${origin}/assets/profile.jpg`;
  const bannerUrl =
    readEnv(locals, 'VISITOR_IMAGE_URL') || `${origin}/assets/luffy.gif`;

  // ── ส่วนหัวสไตล์ terminal ด้วย ANSI (Discord รองรับ ```ansi) ──
  const E = '';
  const W = `${E}[1;37m`; // ขาวเข้ม (bold)
  const D = `${E}[1;30m`; // เทา
  const R = `${E}[0m`; // reset
  const head = isFirst ? 'NEW VISITOR' : 'RETURNING VISITOR';
  const description =
    '```ansi\n' +
    `${W}${head}${R}\n` +
    `${D}${'─'.repeat(24)}${R}\n` +
    `${W}${path}${R} ${D}· ${host}${R}\n` +
    '```';

  const embed = {
    author: { name: `● ${host}`, icon_url: avatar },
    description,
    color: 0xffffff, // ขอบซ้ายขาว = โทนขาวดำ
    thumbnail: { url: avatar },
    fields: [
      { name: 'location', value: country, inline: true },
      { name: 'device', value: `${deviceFromUA(ua)} · ${browserFromUA(ua)}`, inline: true },
      { name: 'source', value: sourceLabel(body.referrer), inline: true },
      { name: 'local time', value: `${time} น. · ${date}`, inline: false },
    ],
    image: { url: bannerUrl },
    footer: { text: host },
    timestamp: new Date().toISOString(),
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: host,
      avatar_url: avatar,
      embeds: [embed],
    }),
  });

  return new Response(JSON.stringify({ ok: res.ok }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
