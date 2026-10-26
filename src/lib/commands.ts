type CommandGroup = "navigation" | "posts" | "info" | "utility";

interface CommandMeta {
    name: string;
    aliases?: string[];
    group: CommandGroup;
    summary: string;
    usage?: string;
    hidden?: boolean;
}

export const SITE = {
    name: "Microkid",
    host: "microkid.com",
    author: "Gurucharan Shivakumar",
    role: "Electronics Engineer & Tech Enthusiast",
    github: "https://github.com/guruela",
    email: "gurushivkrish@gmail.com",
    instagram: "https://instagram.com/itsguru13",
};

export const SOCIALS = [
    { label: "github", href: SITE.github, external: true },
    { label: "email", href: `mailto:${SITE.email}`, external: false },
    { label: "instagram", href: SITE.instagram, external: true },
];

type AboutPart = string | { text: string; ok: true };

interface AboutRow {
    kind: "name" | "role" | "spacer" | "prose" | "socials";
    text?: string;
    parts?: AboutPart[];
}

/* Single source of truth for `about` — rendered on the home page and by the
   about command, so both outputs stay identical. */
export const ABOUT: AboutRow[] = [
    { kind: "name", text: SITE.author },
    { kind: "role", text: SITE.role },
    { kind: "spacer" },
    {
        kind: "prose",
        parts: [
            "Welcome to my little corner of the web — I document my learning journey, share the projects I build, and explore new ideas along the way.",
        ],
    },
    { kind: "spacer" },
    {
        kind: "prose",
        parts: [
            "This site is a terminal. Everything you see is command output. Try ",
            { text: "ls blog", ok: true },
            " to browse posts, or ",
            { text: "help", ok: true },
            " for the full command list.",
        ],
    },
    { kind: "spacer" },
    { kind: "socials" },
];

export const COMMANDS: CommandMeta[] = [
    {
        name: "help",
        aliases: ["?", "h"],
        group: "navigation",
        summary: "list available commands",
        usage: "help [command]",
    },
    {
        name: "ls",
        aliases: ["ll", "dir"],
        group: "navigation",
        summary: "list sections, or blog posts",
        usage: "ls [blog]",
    },
    {
        name: "open",
        group: "navigation",
        summary: "open a section or a post",
        usage: "open <home|blog|index|slug>",
    },
    {
        name: "cat",
        aliases: ["less", "more"],
        group: "navigation",
        summary: "read a post",
        usage: "cat <index|slug>",
    },
    {
        name: "cd",
        group: "navigation",
        summary: "change section",
        usage: "cd <home|blog|..>",
    },
    {
        name: "pwd",
        group: "navigation",
        summary: "print working directory",
    },
    {
        name: "search",
        aliases: ["find", "grep"],
        group: "posts",
        summary: "search blog posts by title or text",
        usage: "search <term>",
    },
    {
        name: "about",
        group: "info",
        summary: "print a short bio",
    },
    {
        name: "whoami",
        group: "info",
        summary: "print the current user",
    },
    {
        name: "neofetch",
        group: "info",
        summary: "print system and author info",
    },
    {
        name: "banner",
        aliases: ["motd"],
        group: "info",
        summary: "print the welcome banner",
    },
    {
        name: "contact",
        aliases: ["social"],
        group: "info",
        summary: "print contact links",
    },
    {
        name: "env",
        group: "info",
        summary: "print environment variables",
    },
    {
        name: "date",
        group: "utility",
        summary: "print the current date and time",
    },
    {
        name: "echo",
        group: "utility",
        summary: "echo text back",
        usage: "echo <text>",
    },
    {
        name: "history",
        group: "utility",
        summary: "print command history",
    },
    {
        name: "theme",
        group: "utility",
        summary: "switch or show the color scheme",
        usage: "theme [name]",
    },
    {
        name: "clear",
        aliases: ["cls"],
        group: "utility",
        summary: "clear the screen",
    },
    {
        name: "man",
        group: "utility",
        summary: "show usage for a command",
        usage: "man <command>",
        hidden: true,
    },
    {
        name: "sudo",
        group: "utility",
        summary: "run a command as superuser",
        hidden: true,
    },
    {
        name: "exit",
        aliases: ["logout", "quit"],
        group: "utility",
        summary: "leave the session",
        hidden: true,
    },
];

export function findCommand(name: string): CommandMeta | undefined {
    const key = name.toLowerCase();
    return COMMANDS.find(
        (c) => c.name === key || (c.aliases ?? []).includes(key),
    );
}

export function commandNames(): string[] {
    return COMMANDS.flatMap((c) => [c.name, ...(c.aliases ?? [])]);
}

interface ThemeMeta {
    id: string;
    label: string;
}

export const DEFAULT_THEME = "dracula";

export const THEMES: ThemeMeta[] = [
    { id: "dracula", label: "Dracula" },
    { id: "catppuccin-latte", label: "Catppuccin Latte" },
    { id: "catppuccin-frappe", label: "Catppuccin Frappé" },
    { id: "catppuccin-macchiato", label: "Catppuccin Macchiato" },
    { id: "catppuccin-mocha", label: "Catppuccin Mocha" },
    { id: "tokyonight", label: "Tokyo Night" },
    { id: "kanagawa", label: "Kanagawa" },
    { id: "gruvbox", label: "Gruvbox" },
];

export function findTheme(query: string): ThemeMeta | undefined {
    const q = query.toLowerCase();
    return (
        THEMES.find((t) => t.id === q) ??
        THEMES.find((t) => t.id.includes(q)) ??
        THEMES.find((t) => t.label.toLowerCase().includes(q))
    );
}
