import type { APIRoute } from 'astro';
import { getPost, deletePost } from '../../lib/posts-store';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// GET /posts/:id — คืนโพสต์เดียวตาม id (ไม่เจอ = 404)
export const GET: APIRoute = async ({ params }) => {
  const post = await getPost(params.id ?? '');
  if (!post) return json({ error: 'ไม่พบโพสต์ id นี้' }, 404);
  return json({ post });
};

// DELETE /posts/:id — ลบโพสต์ตาม id (Task 2)
export const DELETE: APIRoute = async ({ params }) => {
  const deleted = await deletePost(params.id ?? '');
  if (!deleted) return json({ error: 'ไม่พบโพสต์ id นี้' }, 404);
  return json({ message: 'ลบโพสต์เรียบร้อยแล้ว' });
};
