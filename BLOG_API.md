# Task 1 & 2 — Blog API (MongoDB Persistence)

REST API สำหรับ blog เขียนเป็น **Astro server endpoints** — เก็บข้อมูลใน **MongoDB** (Task 2: data persist ข้าม server restart)

## Resource: `posts`

แต่ละโพสต์มี field:

| field       | type   | คำอธิบาย                        |
| ----------- | ------ | ------------------------------- |
| `id`        | string | MongoDB ObjectId (auto)         |
| `title`     | string | หัวข้อโพสต์                      |
| `content`   | string | เนื้อหา                         |
| `createdAt` | string | เวลาที่สร้าง (ISO 8601)         |

## Endpoints

| Method | Path         | คำอธิบาย                  | Status |
| ------ | ------------ | ------------------------- | ------ |
| GET    | `/posts`     | รายการโพสต์ทั้งหมด        | 200    |
| POST   | `/posts`     | สร้างโพสต์ใหม่            | 201    |
| GET    | `/posts/:id` | โพสต์เดียวตาม id          | 200 / 404 |
| DELETE | `/posts/:id` | ลบโพสต์ตาม id *(Task 2)*  | 200 / 404 |

POST body (JSON): `{ "title": "...", "content": "..." }`
ถ้า `title` หรือ `content` ว่าง → `400`. ถ้า body ไม่ใช่ JSON → `400`.

---

## วิธี setup MongoDB

### ตัวเลือก A: MongoDB local (Docker)

```bash
# รัน MongoDB ด้วย Docker (ไม่ต้องติดตั้งเอง)
docker run -d --name mongo -p 27017:27017 mongo:7

# ตรวจสอบว่ารันอยู่
docker ps
```

### ตัวเลือก B: MongoDB Atlas (ฟรี 512MB)

1. สมัครที่ [cloud.mongodb.com](https://cloud.mongodb.com)
2. สร้าง Free Cluster (M0)
3. ไปที่ **Database Access** → สร้าง user + password
4. ไปที่ **Network Access** → Allow `0.0.0.0/0` (หรือ IP ของเรา)
5. กด **Connect** → เลือก **Drivers** → คัดลอก connection string
6. ใส่ใน `.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.xxxxx.mongodb.net/blog
   ```

### ตัวเลือก C: MongoDB local (ติดตั้งเอง)

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

---

## วิธี run

ต้องมี Node.js 18+ และ MongoDB ที่เข้าถึงได้

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตั้งค่า MongoDB URI (สร้างไฟล์ .env)
echo 'MONGODB_URI=mongodb://localhost:27017/blog' > .env

# 3. รัน dev server
npm run dev        # http://localhost:4321
```

## วิธีทดสอบ (curl)

```bash
# 1) สร้างโพสต์ใหม่
curl -X POST http://localhost:4321/posts \
  -H 'content-type: application/json' \
  -d '{"title":"เรียน MongoDB","content":"ลองเก็บ data ใน MongoDB ผ่าน Astro API"}'

# 2) ดูทั้งหมด
curl http://localhost:4321/posts

# 3) ดูโพสต์เดียว (ใส่ id ที่ได้จากข้อ 1)
curl http://localhost:4321/posts/<id>

# 4) ลบโพสต์ (Task 2)
curl -X DELETE http://localhost:4321/posts/<id>

# 5) ยืนยันว่าลบแล้ว (ควรได้ 404)
curl http://localhost:4321/posts/<id>
```

## สิ่งที่เปลี่ยนจาก Task 1 → Task 2

| หัวข้อ | Task 1 | Task 2 |
| ------ | ------ | ------ |
| Storage | in-memory array | MongoDB collection |
| Persist | ❌ รีสตาร์ทแล้วหาย | ✅ persist ข้าม restart |
| DELETE | ไม่มี | `DELETE /posts/:id` |
| Config | ไม่มี env | `MONGODB_URI` ใน `.env` |
| id format | sequential number | MongoDB ObjectId |

## Environment Variables

| ตัวแปร | จำเป็น | ตัวอย่าง |
| ------ | ------ | -------- |
| `MONGODB_URI` | ✅ | `mongodb://localhost:27017/blog` |

## ไฟล์ที่เกี่ยวข้อง

- `src/lib/db.ts` — MongoDB connection (reuse client)
- `src/lib/posts-store.ts` — CRUD functions (list, get, create, delete)
- `src/pages/posts/index.ts` — `GET /posts`, `POST /posts`
- `src/pages/posts/[id].ts` — `GET /posts/:id`, `DELETE /posts/:id`
- `.env.example` — ตัวอย่าง environment variables
