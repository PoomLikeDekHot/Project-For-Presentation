# Phum · Portfolio (Astro)

พอร์ตโฟลิโอของ ณัฐเศรษฐ สีถาพล (Phum) — แปลงจากไฟล์ HTML หน้าเดียวมาเป็นโปรเจกต์ Astro แบบแยก component และแยกรูป/วิดีโอออกมาเป็นไฟล์จริงใน `public/assets/`

## โครงสร้าง

```
portfolio-astro/
├── .github/workflows/      GitHub Actions สำหรับ build/push Docker image
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

หน้า portfolio ยัง deploy บน Vercel / Netlify / Cloudflare Pages ได้ตามปกติ
(บน Vercel เลือก framework preset เป็น Astro แล้ว build command `npm run build`, output `dist`)

ส่วน Blog API มี Docker workflow แยกไว้ใน [BLOG_API.md](BLOG_API.md)

## Task 5: CI/CD + Image Publishing

Objective: simulate production workflow ด้วย GitHub Actions โดย build Docker image จาก `Dockerfile` แล้ว push ไป Docker Hub

Workflow file:

- `.github/workflows/docker-image.yml`

ต้องตั้งค่า GitHub Secrets ก่อนรัน:

| Secret | ใช้ทำอะไร |
| ------ | ---------- |
| `DOCKERHUB_USERNAME` | Docker Hub username หรือ namespace |
| `DOCKERHUB_TOKEN` | Docker Hub access token สำหรับ push image |

Flow:

1. push code เข้า branch `main` หรือกด run workflow เองจาก GitHub Actions
2. GitHub Actions checkout code
3. login Docker Hub ด้วย secrets
4. build Docker image จาก `Dockerfile`
5. push image ไป Docker Hub พร้อม tags `latest` และ `v1` (หรือ tag ที่กรอกตอน manual run)

Docker image:

- https://hub.docker.com/r/phxpoom/project-for-presentation
- tags: `latest`, `v1`

ไม่มี username/token ถูก hardcode ใน workflow

## แก้เนื้อหา

- เพิ่ม/แก้โปรเจกต์ → แก้ไฟล์เดียวที่ [`src/data/projects.ts`](src/data/projects.ts)
- เปลี่ยนรูป/วิดีโอ → วางไฟล์ใน `public/assets/` แล้วอ้าง path `/assets/...`
