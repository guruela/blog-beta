# My Personal Website & Blog

This repo contains the source code of my website. This site serves as a space to document my learning journey, showcasing projects I'm building and ideas I'm exploring.

It is built using **[Astro](https://astro.build/)**, JavaScript Framework.

The UI is styled as an interactive terminal — type `help` for the available commands.

## File Structure

Here's a quick overview of how the project is organized:

```text
/
├── public/                 # Static assets like images and fonts
├── src/
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Page layouts
│   ├── lib/                # Shared data (site info, commands, themes)
│   ├── pages/              # Routing pages
│   │   ├── index.astro     # Home page
│   │   ├── blog.astro      # The blog feed
│   │   ├── 404.astro       # Custom 404 error page
│   │   └── posts/          # Markdown (.md) files for individual blog posts
│   ├── scripts/            # Client-side JavaScript
│   └── styles/             # Global CSS styles (global.css)
└── package.json            # Project dependencies and scripts
```

> **Note**: This website is still in beta and I have many plans to upgrade the layout and the "look and feel" in the upcoming days.