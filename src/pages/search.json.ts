export async function GET() {
    const posts = Object.values(import.meta.glob('./posts/*.md', { eager: true })) as any[];
    
    const searchIndex = posts.map(post => ({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        pubDate: post.frontmatter.pubDate,
        url: post.url
    }));

    return new Response(JSON.stringify(searchIndex), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
