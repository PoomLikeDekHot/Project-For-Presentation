// ── MongoDB store สำหรับ blog posts (Task 2: Persistence) ──
// เปลี่ยนจาก in-memory array เป็น MongoDB collection
// data persist ข้าม server restart ตามโจทย์ Task 2

import { ObjectId } from 'mongodb';
import { getDb } from './db';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601
  views: number; // Task 3: จำนวนการเข้าดู
}

/** ชื่อ collection ใน MongoDB */
const COLLECTION = 'posts';

/** helper: แปลง MongoDB document → Post (เปลี่ยน _id เป็น id) */
function toPost(doc: any): Post {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt,
    views: doc.views ?? 0, // โพสต์เก่าที่ยังไม่มี field views → นับเป็น 0
  };
}

/** คืนรายการโพสต์ทั้งหมด (ใหม่สุดอยู่บน) */
export async function listPosts(): Promise<Post[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toPost);
}

/** คืนโพสต์เดียวตาม id (ไม่เจอ = null) */
export async function getPost(id: string): Promise<Post | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toPost(doc) : null;
}

/** สร้างโพสต์ใหม่และเก็บลง MongoDB */
export async function createPost(input: { title: string; content: string }): Promise<Post> {
  const db = await getDb();
  const now = new Date().toISOString();
  const result = await db.collection(COLLECTION).insertOne({
    title: input.title,
    content: input.content,
    createdAt: now,
    views: 0, // Task 3: เริ่มต้นที่ 0 view
  });
  return {
    id: result.insertedId.toString(),
    title: input.title,
    content: input.content,
    createdAt: now,
    views: 0,
  };
}

/** ลบโพสต์ตาม id — คืน true ถ้าลบสำเร็จ, false ถ้าไม่เจอ */
export async function deletePost(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

/** Task 3: เพิ่ม view +1 ให้โพสต์ — คืนโพสต์ที่อัปเดตแล้ว (ไม่เจอ = null) */
export async function incrementView(id: string): Promise<Post | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db
    .collection(COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
  return doc ? toPost(doc) : null;
}

/** Task 3: คืนโพสต์ยอดวิวสูงสุด N อันแรก (default 3) */
export async function topPosts(limit = 3): Promise<Post[]> {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find()
    .sort({ views: -1, createdAt: -1 }) // วิวมากก่อน, เท่ากันเอาใหม่กว่าก่อน
    .limit(limit)
    .toArray();
  return docs.map(toPost);
}
