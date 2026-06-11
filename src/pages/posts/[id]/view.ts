import type { APIRoute } from 'astro';
import { incrementView } from '../../../lib/posts-store';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// POST /posts/:id/view — เพิ่มยอดวิวให้โพสต์ +1 (Task 3)
export const POST: APIRoute = async ({ params }) => {
  const post = await incrementView(params.id ?? '');
  if (!post) return json({ error: 'ไม่พบโพสต์ id นี้' }, 404);
  return json({ post });
};
