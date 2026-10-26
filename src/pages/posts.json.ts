export interface PostManifestEntry {
    slug: string;
    title: string;
    pubDate: string;
    description: string;
    url: string;
}

export async function GET() {
    const posts = Object.values(
        import.meta.glob("./posts/*.md", { eager: true }),
    ) as any[];

    const manifest: PostManifestEntry[] = posts
        .map((post) => ({
            slug: String(post.url).split("/").filter(Boolean).pop() ?? "",
            title: post.frontmatter.title as string,
            pubDate: post.frontmatter.pubDate as string,
            description: (post.frontmatter.description as string) ?? "",
            url: post.url as string,
        }))
        .sort(
            (a, b) =>
                new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
        );

    return new Response(JSON.stringify(manifest), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
