import type { APIRoute } from 'astro';
import { getPost } from '../../lib/posts-store';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// GET /posts/:id — คืนโพสต์เดียวตาม id (ไม่เจอ = 404)
export const GET: APIRoute = ({ params }) => {
  const post = getPost(params.id ?? '');
  if (!post) return json({ error: 'ไม่พบโพสต์ id นี้' }, 404);
  return json({ post });
};
