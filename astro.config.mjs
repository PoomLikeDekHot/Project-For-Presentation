// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://natthaseth.online',
  integrations: [sitemap()],
  // inline CSS เข้า HTML เลย → ไม่มี request CSS ที่บล็อกการ render
  build: { inlineStylesheets: 'always' },
  // เว็บยังเป็น static เป็นหลัก แต่เปิด adapter ไว้ให้ endpoint /api/* รันฝั่ง server ได้
  adapter: cloudflare(),
});
