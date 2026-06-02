# Phum · Portfolio (Astro)

พอร์ตโฟลิโอของ ณัฐเศรษฐ สีถาพล (Phum) — แปลงจากไฟล์ HTML หน้าเดียวมาเป็นโปรเจกต์ Astro แบบแยก component และแยกรูป/วิดีโอออกมาเป็นไฟล์จริงใน `public/assets/`

## โครงสร้าง

```
portfolio-astro/
├── public/assets/          รูปและวิดีโอจริง (เดิมฝัง base64 ในไฟล์ HTML)
├── src/
│   ├── data/projects.ts    ข้อมูลโปรเจกต์ทั้งหมด (การ์ด + modal)
│   ├── layouts/Layout.astro หัวเว็บ ฟอนต์ และเลเยอร์พื้นหลัง
│   ├── components/         Nav, Hero, About, Projects, ProjectCard, Stack, Footer, Modals
│   ├── styles/global.css   CSS ทั้งหมด (ยกมาจากต้นฉบับ)
│   └── pages/index.astro   หน้าเดียว รวมทุก component + client script
└── astro.config.mjs
```

## คำสั่ง

```bash
npm install      # ติดตั้ง dependencies
npm run dev      # รัน dev server ที่ http://localhost:4321
npm run build    # build เป็น static site ไปที่ dist/
npm run preview  # ดู build ที่ build เสร็จแล้ว
```

## Deploy

เป็น static site ล้วน → deploy บน Vercel / Netlify / Cloudflare Pages ได้เลย
(บน Vercel เลือก framework preset เป็น Astro แล้ว build command `npm run build`, output `dist`)

## แก้เนื้อหา

- เพิ่ม/แก้โปรเจกต์ → แก้ไฟล์เดียวที่ [`src/data/projects.ts`](src/data/projects.ts)
- เปลี่ยนรูป/วิดีโอ → วางไฟล์ใน `public/assets/` แล้วอ้าง path `/assets/...`
