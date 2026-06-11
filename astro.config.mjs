// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Task 4: เลือก adapter ตามสภาพแวดล้อม
// - ตอนรันใน Docker ตั้ง BUILD_TARGET=node → ใช้ Node adapter (รันเป็น server ได้)
// - ปกติ (deploy เว็บ portfolio) ใช้ Cloudflare adapter เหมือนเดิม
const isNode = process.env.BUILD_TARGET === 'node';

// https://astro.build/config
export default defineConfig({
  site: 'https://natthaseth.online',
  integrations: [sitemap()],
  // inline CSS เข้า HTML เลย → ไม่มี request CSS ที่บล็อกการ render
  build: { inlineStylesheets: 'always' },
  // นี่เป็น JSON REST API (ไม่ใช่ฟอร์ม) — ปิด origin-check เพื่อให้ POST endpoint
  // เช่น /posts/:id/view เรียกได้โดยไม่ต้องบังคับส่ง header แปลกๆ
  // (ค่า default ของ Astro = true จะ block POST ที่ origin ไม่ตรงใน production)
  security: { checkOrigin: false },
  // เว็บยังเป็น static เป็นหลัก แต่เปิด adapter ไว้ให้ endpoint /api/* รันฝั่ง server ได้
  adapter: isNode ? node({ mode: 'standalone' }) : cloudflare(),
});
