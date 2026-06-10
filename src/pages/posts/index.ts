import type { APIRoute } from 'astro';
import { listPosts, createPost } from '../../lib/posts-store';

// endpoint ต้องรันฝั่ง server (ไม่ prerender) เพราะข้อมูลเป็น dynamic
export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// GET /posts — คืนรายการโพสต์ทั้งหมด (จาก MongoDB)
export const GET: APIRoute = async () => json({ posts: await listPosts() });

// POST /posts — สร้างโพสต์ใหม่จาก body JSON { title, content }
export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'body ต้องเป็น JSON ที่ถูกต้อง' }, 400);
  }

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  if (!title || !content) {
    return json({ error: 'ต้องมี title และ content และห้ามว่าง' }, 400);
  }

  const post = await createPost({ title, content });
  return json({ post }, 201);
};
