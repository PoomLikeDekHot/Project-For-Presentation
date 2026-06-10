// ── MongoDB connection (Task 2: Persistence) ──
// ใช้ environment variable MONGODB_URI เชื่อม MongoDB
// reuse connection เพื่อไม่ให้เปิด connection ใหม่ทุก request

import { MongoClient, type Db } from 'mongodb';

let client: MongoClient;
let db: Db;

/** คืน Db instance (reuse connection) */
export async function getDb(): Promise<Db> {
  if (db) return db;
  
  const uri = (typeof import.meta.env !== 'undefined' ? import.meta.env.MONGODB_URI : undefined) || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI ยังไม่ได้ตั้งค่า — ใส่ใน .env เช่น MONGODB_URI=mongodb://localhost:27017/blog'
    );
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // ใช้ชื่อ db จาก URI string
  return db;
}
