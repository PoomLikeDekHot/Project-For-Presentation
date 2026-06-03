// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://phum-portfolio.example.com',
  // เว็บยังเป็น static เป็นหลัก แต่เปิด adapter ไว้ให้ endpoint /api/* รันฝั่ง server ได้
  adapter: cloudflare(),
});
