import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ status: "ok" }), {
    headers: {
      "Content-Type": "application/health+json",
    },
    status: 200,
  });
