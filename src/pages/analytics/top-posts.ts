import type { APIRoute } from 'astro';
import { topPosts } from '../../lib/posts-store';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

// GET /analytics/top-posts — โพสต์ยอดวิวสูงสุด 3 อันแรก (Task 3)
export const GET: APIRoute = async () => json({ posts: await topPosts(3) });
