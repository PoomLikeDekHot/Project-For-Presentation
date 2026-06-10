// ── In-memory store สำหรับ blog posts (Task 1: ห้ามใช้ database) ──
// ข้อมูลเก็บอยู่ใน memory ของ process เท่านั้น → รีสตาร์ทเซิร์ฟเวอร์แล้วข้อมูลหาย
// (บน serverless/Cloudflare หลาย instance ข้อมูลอาจไม่ sync กัน — เหมาะกับรันทดสอบ local)

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 เช่น 2026-06-10T08:00:00.000Z
}

// seed ตัวอย่างไว้ 1 อัน เพื่อให้ GET /posts มีข้อมูลให้ดูตั้งแต่แรก
const posts: Post[] = [
  {
    id: '1',
    title: 'โพสต์แรกของบล็อก',
    content: 'ยินดีต้อนรับสู่ Blog API — นี่คือโพสต์ตัวอย่างที่ seed ไว้ใน memory',
    createdAt: new Date().toISOString(),
  },
];
let seq = posts.length; // ตัวนับ id ถัดไป

/** คืนรายการโพสต์ทั้งหมด (ใหม่สุดอยู่บน) */
export function listPosts(): Post[] {
  return [...posts].reverse();
}

/** คืนโพสต์เดียวตาม id (ไม่เจอ = undefined) */
export function getPost(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

/** สร้างโพสต์ใหม่และเก็บลง store */
export function createPost(input: { title: string; content: string }): Post {
  const post: Post = {
    id: String(++seq),
    title: input.title,
    content: input.content,
    createdAt: new Date().toISOString(),
  };
  posts.push(post);
  return post;
}
