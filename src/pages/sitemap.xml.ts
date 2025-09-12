import { getCollection } from "astro:content";

export async function GET({ request }: { request: Request }) {
    const origin = new URL(request.url).origin;

    const staticRoutes: Array<{ path: string; requiresAuth: boolean }> = [
        { path: "/", requiresAuth: false },
        { path: "/lessons", requiresAuth: false },
        { path: "/availability", requiresAuth: false },
        { path: "/premium", requiresAuth: false },
    ];

    const lessons = await getCollection("lessons");

    const allUrls: Array<{ loc: string; requiresAuth: boolean }> = [
        ...staticRoutes.map((r) => ({ loc: `${origin}${r.path}`, requiresAuth: r.requiresAuth })),
        ...lessons.map((l) => ({ loc: `${origin}/lessons/${l.id}`, requiresAuth: Boolean(l.data.premium) })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:x="http://example.com/sitemap-extensions">\n` +
        allUrls.map((u) => (
            `  <url>\n` +
            `    <loc>${u.loc}</loc>\n` +
            (u.requiresAuth ? `    <x:requiresAuth>true</x:requiresAuth>\n` : "") +
            `  </url>`
        )).join("\n") +
        `\n</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
}


