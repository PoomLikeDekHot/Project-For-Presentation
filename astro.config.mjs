// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://natthaseth.online',
  integrations: [sitemap()],
  // เว็บยังเป็น static เป็นหลัก แต่เปิด adapter ไว้ให้ endpoint /api/* รันฝั่ง server ได้
  adapter: cloudflare(),
});
