# Task 1 — Blog API (No Database)

REST API สำหรับ blog เขียนเป็น **Astro server endpoints** (ต่อยอดจาก pattern เดิมของโปรเจกต์ที่ `src/pages/api/visit.ts`) — เก็บข้อมูลแบบ **in-memory ไม่มี database** ตามโจทย์

## Resource: `posts`

แต่ละโพสต์มี field:

| field       | type   | คำอธิบาย                        |
| ----------- | ------ | ------------------------------- |
| `id`        | string | auto-generated                  |
| `title`     | string | หัวข้อโพสต์                      |
| `content`   | string | เนื้อหา                         |
| `createdAt` | string | เวลาที่สร้าง (ISO 8601)         |

## Endpoints

| Method | Path         | คำอธิบาย                  | Status |
| ------ | ------------ | ------------------------- | ------ |
| GET    | `/posts`     | รายการโพสต์ทั้งหมด        | 200    |
| POST   | `/posts`     | สร้างโพสต์ใหม่            | 201    |
| GET    | `/posts/:id` | โพสต์เดียวตาม id          | 200 / 404 |

POST body (JSON): `{ "title": "...", "content": "..." }`
ถ้า `title` หรือ `content` ว่าง → `400`. ถ้า body ไม่ใช่ JSON → `400`.

## วิธี run

ต้องมี Node.js 18+ (เทสต์บน v24)

```bash
npm install
npm run dev        # รันที่ http://localhost:4321
```

## วิธีทดสอบ (curl)

```bash
# 1) ดูทั้งหมด (มี seed ไว้ 1 โพสต์)
curl http://localhost:4321/posts

# 2) สร้างโพสต์ใหม่
curl -X POST http://localhost:4321/posts \
  -H 'content-type: application/json' \
  -d '{"title":"เรียน Astro API","content":"ลองสร้าง REST API ด้วย Astro endpoints"}'

# 3) ดูโพสต์เดียว
curl http://localhost:4321/posts/2
```

## หมายเหตุ

- ข้อมูลเก็บใน memory ของ process (`src/lib/posts-store.ts`) — **รีสตาร์ทเซิร์ฟเวอร์แล้วข้อมูลหาย** ตามข้อกำหนด "ห้ามใช้ database"
- มี seed โพสต์ตัวอย่างไว้ 1 อัน ให้ `GET /posts` มีข้อมูลตั้งแต่แรก
- โปรเจกต์ใช้ Cloudflare adapter (สำหรับ deploy เว็บหลัก) — บน serverless จริงแต่ละ request อาจวิ่งคนละ instance ทำให้ in-memory ไม่ sync กัน; in-memory store เหมาะกับการรัน/ทดสอบ local ตามโจทย์ Task 1

## ไฟล์ที่เกี่ยวข้อง

- `src/lib/posts-store.ts` — in-memory store + ฟังก์ชัน list/get/create
- `src/pages/posts/index.ts` — `GET /posts`, `POST /posts`
- `src/pages/posts/[id].ts` — `GET /posts/:id`
