import {
    ABOUT,
    COMMANDS,
    DEFAULT_THEME,
    SITE,
    SOCIALS,
    THEMES,
    commandNames,
    findCommand,
    findTheme,
} from "../lib/commands";

interface PostMeta {
    slug: string;
    title: string;
    pubDate: string;
    description: string;
    url: string;
}

const USER = "user";
const HOST = "microkid";
const HISTORY_KEY = "terminal-history";
const BOOT_KEY = "terminal-booted";
const POSTS_KEY = "terminal-posts";
const THEME_KEY = "terminal-theme";
const NAV_KEY = "terminal-nav-command";

let posts: PostMeta[] = [];
let postsPromise: Promise<void> | null = null;
let history: string[] = [];
let historyIndex = -1;
let activeCommand = "";

function output(): HTMLElement | null {
    return document.getElementById("terminal-output");
}

function bodyEl(): HTMLElement | null {
    return document.getElementById("terminal-body");
}

function promptInput(): HTMLInputElement | null {
    return document.getElementById("terminal-input") as HTMLInputElement | null;
}

function el(tag: string, text = "", cls = ""): HTMLElement {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
}

function anchor(text: string, href: string, cls = "link"): HTMLAnchorElement {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    a.className = cls;
    if (/^https?:/.test(href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }
    return a;
}

function scrollDown() {
    // Desktop scrolls the terminal shell (prompt flows with output);
    // mobile scrolls the inner body (prompt is a pinned footer).
    const terminal = document.getElementById("terminal");
    if (terminal && terminal.scrollHeight > terminal.clientHeight) {
        terminal.scrollTop = terminal.scrollHeight;
    }
    const body = bodyEl();
    if (body && body.scrollHeight > body.clientHeight) {
        body.scrollTop = body.scrollHeight;
    }
}

function outRow(cls: string, ...parts: (string | Node)[]): HTMLElement | null {
    const out = output();
    if (!out) return null;
    const row = document.createElement("div");
    row.className = "out" + (cls ? " " + cls : "");
    for (const part of parts) {
        row.appendChild(
            typeof part === "string" ? document.createTextNode(part) : part,
        );
    }
    out.appendChild(row);
    scrollDown();
    return row;
}

function line(...parts: (string | Node)[]): HTMLElement | null {
    return outRow("", ...parts);
}

function print(text: string, cls = "") {
    text.split("\n").forEach((l) => {
        const out = output();
        if (!out) return;
        const row = document.createElement("div");
        row.className = "out" + (cls ? " " + cls : "");
        row.textContent = l;
        out.appendChild(row);
    });
    scrollDown();
}

function focusPrompt() {
    const input = promptInput();
    if (input && document.activeElement !== input) {
        input.focus({ preventScroll: true });
    }
}

function cwdLabel(): string {
    const path = window.location.pathname.replace(/\/$/, "");
    if (!path) return "~";
    if (path === "/blog" || path.startsWith("/blog")) return "~/blog";
    if (path.startsWith("/posts/")) {
        return "~/posts/" + path.split("/").filter(Boolean).pop();
    }
    return path;
}

function promptPrefix(): HTMLElement {
    const span = document.createElement("span");
    span.className = "ps1";
    span.innerHTML =
        `<span class="pu">${USER}</span>` +
        `<span class="punc">@</span>` +
        `<span class="ph">${HOST}</span>` +
        `<span class="punc">:</span>` +
        `<span class="pp">${cwdLabel()}</span>` +
        `<span class="punc">$</span>`;
    return span;
}

function echoCommand(command: string) {
    line(promptPrefix(), command ? " " + command : "");
}

function resizeInput(input: HTMLInputElement) {
    input.style.width = `${Math.max(input.value.length, 0.5)}ch`;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function currentTheme(): string {
    return (
        document.documentElement.getAttribute("data-theme") ?? DEFAULT_THEME
    );
}

function applyTheme(id: string) {
    document.documentElement.setAttribute("data-theme", id);
    try {
        localStorage.setItem(THEME_KEY, id);
    } catch {
        /* ignore */
    }
}

function cmdTheme(args: string[]) {
    const query = (args[0] ?? "").toLowerCase();
    if (!query) {
        const active = currentTheme();
        print(`current theme: ${active}`, "ok");
        print("available themes:", "dim");
        THEMES.forEach((theme) => {
            const isActive = theme.id === active;
            line(
                el("span", isActive ? "  * " : "    ", "ok"),
                el("span", theme.id, isActive ? "ok" : ""),
                el("span", `  ${theme.label}`, "dim"),
            );
        });
        print("Use 'theme <name>' to switch. Choice is saved.", "dim");
        return;
    }
    const match = findTheme(query);
    if (!match) {
        print(`theme: unknown theme '${args[0]}'. Try 'theme'.`, "err");
        return;
    }
    applyTheme(match.id);
    print(`theme set to ${match.id} (${match.label}).`, "ok");
}

function loadHistory() {
    try {
        const raw = sessionStorage.getItem(HISTORY_KEY);
        if (raw) history = JSON.parse(raw);
    } catch {
        history = [];
    }
    historyIndex = history.length;
}

function pushHistory(command: string) {
    if (!command) return;
    if (history[history.length - 1] === command) return;
    history.push(command);
    try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
        /* ignore */
    }
    historyIndex = history.length;
}

function recall(direction: number, input: HTMLInputElement) {
    if (!history.length) return;
    if (direction < 0) {
        historyIndex = Math.max(0, historyIndex - 1);
    } else {
        historyIndex = Math.min(history.length, historyIndex + 1);
    }
    input.value = historyIndex >= history.length ? "" : history[historyIndex];
    resizeInput(input);
    input.setSelectionRange(input.value.length, input.value.length);
}

function commonPrefix(values: string[]): string {
    if (!values.length) return "";
    return values.reduce((acc, value) => {
        let i = 0;
        while (i < acc.length && i < value.length && acc[i] === value[i]) i++;
        return acc.slice(0, i);
    });
}

function complete(input: HTMLInputElement) {
    const value = input.value;
    const parts = value.split(/\s+/);
    const isFirst = parts.length <= 1;
    const token = (isFirst ? parts[0] : parts[1]) ?? "";
    let candidates: string[] = [];

    const verb = parts[0].toLowerCase();
    if (isFirst) {
        candidates = commandNames();
    } else if (["open", "cat", "less", "more"].includes(verb)) {
        candidates = posts.map((p) => p.slug);
    } else if (["cd", "ls"].includes(verb)) {
        candidates = ["home", "blog", "posts", ...posts.map((p) => p.slug)];
    } else if (verb === "theme") {
        candidates = THEMES.map((t) => t.id);
    } else {
        return;
    }

    const matches = [...new Set(candidates)].filter((c) =>
        c.startsWith(token.toLowerCase()),
    );
    if (!matches.length) return;

    const completion =
        matches.length === 1 ? matches[0] : commonPrefix(matches);
    input.value = isFirst ? completion : `${parts[0]} ${completion}`;

    if (matches.length > 1) print(matches.join("   "), "dim");

    resizeInput(input);
    input.setSelectionRange(input.value.length, input.value.length);
}

function readCachedPosts(): PostMeta[] | null {
    try {
        const raw = sessionStorage.getItem(POSTS_KEY);
        return raw ? (JSON.parse(raw) as PostMeta[]) : null;
    } catch {
        return null;
    }
}

function loadPosts(): Promise<void> {
    if (postsPromise) return postsPromise;
    const cached = readCachedPosts();
    if (cached) {
        posts = cached;
        postsPromise = Promise.resolve();
        return postsPromise;
    }
    postsPromise = fetch("/posts.json")
        .then((r) => (r.ok ? r.json() : []))
        .then((data: PostMeta[]) => {
            posts = Array.isArray(data) ? data : [];
            try {
                sessionStorage.setItem(POSTS_KEY, JSON.stringify(posts));
            } catch {
                /* ignore */
            }
        })
        .catch(() => {
            posts = [];
        });
    return postsPromise;
}

function fmtDate(value: string): string {
    const d = new Date(value);
    if (Number.isNaN(d.valueOf())) return value;
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function cmdHelp(args: string[]) {
    if (args[0]) return cmdMan(args);
    print("Available commands:", "ok");
    const labels: Record<string, string> = {
        navigation: "navigation",
        posts: "blog",
        info: "info",
        utility: "utility",
    };
    for (const group of ["navigation", "posts", "info", "utility"]) {
        line(el("span", `  ${labels[group]}`, "header"));
        COMMANDS.filter((c) => c.group === group && !c.hidden).forEach((c) => {
            line(
                el("span", "    "),
                el("span", c.name, "ok"),
                el("span", `  ${c.summary}`, "dim"),
            );
        });
    }
    print("");
    print("Tip: ↑/↓ history · Tab completes · Ctrl+L clears the screen.", "dim");
}

function cmdMan(args: string[]) {
    const name = args[0];
    if (!name) {
        print("usage: man <command>", "warn");
        return;
    }
    const command = findCommand(name);
    if (!command) {
        print(`man: no manual entry for ${name}`, "err");
        return;
    }
    print(`${command.name} — ${command.summary}`, "ok");
    if (command.usage) print(`usage: ${command.usage}`, "dim");
    if (command.aliases?.length) {
        print(`aliases: ${command.aliases.join(", ")}`, "dim");
    }
}

function cmdAbout() {
    for (const row of ABOUT) {
        if (row.kind === "spacer") {
            outRow("spacer");
        } else if (row.kind === "name") {
            outRow("intro-name", row.text ?? "");
        } else if (row.kind === "role") {
            outRow("dim", row.text ?? "");
        } else if (row.kind === "prose") {
            outRow(
                "prose",
                ...(row.parts ?? []).map((part) =>
                    typeof part === "string"
                        ? part
                        : el("span", part.text, "ok"),
                ),
            );
        } else if (row.kind === "socials") {
            outRow(
                "socials",
                ...SOCIALS.map((social) => anchor(social.label, social.href)),
            );
        }
    }
}

async function cmdNeofetch() {
    await loadPosts();
    const art = [
        "        .--.        ",
        "       |o_o |       ",
        "       |:_/ |       ",
        "      //   \\ \\      ",
        "     (|     | )     ",
        "    /'\\_   _/`\\     ",
        "    \\___)=(___/     ",
    ];
    const info = [
        `${USER}@${HOST}`,
        "-----------------",
        `OS: Microkid OS`,
        `Host: ${SITE.host}`,
        `Kernel: astro-7.0.3`,
        `Shell: zsh 5.9`,
        `Theme: ${currentTheme()}`,
        `Posts: ${posts.length}`,
        `Locale: en-GB`,
    ];
    const rows = Math.max(art.length, info.length);
    for (let i = 0; i < rows; i++) {
        line(
            el("span", (art[i] ?? " ".repeat(20)) + "  ", "accent"),
            el("span", info[i] ?? "", i === 0 ? "ok" : i === 1 ? "dim" : ""),
        );
    }
}

function cmdBanner() {
    const art = [
        " __  __ _                  _    _ _ ",
        "|  \\/  (_) ___ _ __ ___    | | _(_) |",
        "| |\\/| | |/ __| '__/ _ \\   | |/ / | |",
        "| |  | | | (__| | | (_) |  |   <| | |",
        "|_|  |_|_|\\___|_|  \\___/   |_|\\_\\_|_|",
    ];
    art.forEach((l) => line(el("span", l, "accent")));
    print("");
    print(`${SITE.name} — ${SITE.role}`, "dim");
    print("Type 'help' to see what this shell can do.", "dim");
}

function cmdContact() {
    line(el("span", "  github     ", "dim"), anchor(SITE.github, SITE.github));
    line(
        el("span", "  email      ", "dim"),
        anchor(SITE.email, `mailto:${SITE.email}`),
    );
    line(
        el("span", "  instagram  ", "dim"),
        anchor("@itsguru13", SITE.instagram),
    );
}

async function cmdEnv() {
    await loadPosts();
    const vars: [string, string][] = [
        ["SITE", SITE.name],
        ["AUTHOR", SITE.author],
        ["ROLE", SITE.role],
        ["HOST", SITE.host],
        ["STACK", "astro 7 · static · no js frameworks"],
        ["THEME", currentTheme()],
        ["POSTS", String(posts.length)],
        ["SHELL", "microkid-sh"],
    ];
    vars.forEach(([k, v]) => {
        line(el("span", `${k}=`, "dim"), el("span", v, "ok"));
    });
}

function listSections() {
    print("total 2", "dim");
    line(
        el("span", "drwxr-xr-x  ", "dim"),
        anchor("home/", "/"),
        el("span", "  → home directory", "dim"),
    );
    line(
        el("span", "drwxr-xr-x  ", "dim"),
        anchor("blog/", "/blog"),
        el("span", `  → ${posts.length} posts`, "dim"),
    );
}

async function cmdLs(args: string[]) {
    const target = (args[0] ?? "").toLowerCase();
    const cwd = cwdLabel();
    const inBlogDir =
        cwd.startsWith("~/blog") || cwd.startsWith("~/posts/");
    const wantsPosts =
        ["blog", "posts", "~/blog", "~/posts"].includes(target) ||
        (!target && inBlogDir);

    if (wantsPosts) {
        await loadPosts();
        if (!posts.length) {
            print("blog/ is empty.", "dim");
            return;
        }
        print(`total ${posts.length}`, "dim");
        posts.forEach((post, i) => {
            line(
                el("span", `[${String(i + 1).padStart(2, " ")}] `, "dim"),
                el("span", `${fmtDate(post.pubDate)}  `, "dim"),
                anchor(post.title, post.url),
                el("span", `  → ${post.slug}`, "dim"),
            );
        });
        print("");
        print("Use 'open <index>' or 'open <slug>' to read a post.", "dim");
        return;
    }
    await loadPosts();
    listSections();
}

function navigate(path: string) {
    if (activeCommand) {
        try {
            sessionStorage.setItem(NAV_KEY, activeCommand);
        } catch {
            /* ignore */
        }
    }
    print(`Opening ${path} …`, "dim");
    setTimeout(() => window.location.assign(path), 200);
}

async function cmdOpen(args: string[]) {
    const target = (args[0] ?? "").trim();
    if (!target) {
        print("usage: open <index|slug>", "warn");
        return;
    }
    const t = target.toLowerCase();

    if (/^\d+$/.test(t)) {
        await loadPosts();
        const post = posts[parseInt(t, 10) - 1];
        if (!post) {
            print(`open: no post at index ${t}`, "err");
            return;
        }
        return navigate(post.url);
    }

    await loadPosts();
    const post = posts.find((p) => p.slug === t || p.slug.startsWith(t));
    if (!post) {
        print(`open: '${target}' not found. Try 'ls blog'.`, "err");
        return;
    }
    return navigate(post.url);
}

function cmdCd(args: string[]) {
    const t = (args[0] ?? "").toLowerCase();
    const cwd = cwdLabel();
    if (!t || ["~", "home", "/"].includes(t)) return navigate("/");
    if (t === "..") {
        return navigate(cwd.startsWith("~/posts/") ? "/blog" : "/");
    }
    if (["blog", "posts"].includes(t)) return navigate("/blog");
    print(`cd: no such directory: ${args[0]}`, "err");
}

async function cmdSearch(args: string[]) {
    const query = args.join(" ").toLowerCase().trim();
    if (!query) {
        print("usage: search <term>", "warn");
        return;
    }
    await loadPosts();
    const hits = posts
        .map((post, i) => ({ post, i }))
        .filter(
            ({ post }) =>
                post.title.toLowerCase().includes(query) ||
                post.slug.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query),
        );
    if (!hits.length) {
        print(`search: no posts match '${args.join(" ")}'`, "dim");
        return;
    }
    print(`${hits.length} match(es) for '${args.join(" ")}':`, "ok");
    hits.forEach(({ post, i }) => {
        line(
            el("span", `[${String(i + 1).padStart(2, " ")}] `, "dim"),
            anchor(post.title, post.url),
            el("span", `  → ${post.slug}`, "dim"),
        );
    });
}

function cmdHistory() {
    if (!history.length) {
        print("history: no commands yet.", "dim");
        return;
    }
    history.forEach((cmd, i) => {
        line(
            el("span", `${String(i + 1).padStart(4, " ")}  `, "dim"),
            el("span", cmd),
        );
    });
}

function clearScreen() {
    const out = output();
    if (out) out.innerHTML = "";
}

async function dispatch(command: string, args: string[]) {
    switch (command) {
        case "help":
        case "?":
        case "h":
            return cmdHelp(args);
        case "man":
            return cmdMan(args);
        case "about":
            return cmdAbout();
        case "whoami":
            return print(USER);
        case "neofetch":
            return cmdNeofetch();
        case "banner":
        case "motd":
            return cmdBanner();
        case "contact":
        case "social":
            return cmdContact();
        case "env":
            return cmdEnv();
        case "date":
            return print(new Date().toString());
        case "ls":
        case "ll":
        case "dir":
            return cmdLs(args);
        case "open":
            return cmdOpen(args);
        case "cat":
        case "less":
        case "more":
            return cmdOpen(args);
        case "cd":
            return cmdCd(args);
        case "pwd":
            return print(cwdLabel());
        case "search":
        case "find":
        case "grep":
            return cmdSearch(args);
        case "history":
            return cmdHistory();
        case "echo":
            return print(args.join(" "));
        case "theme":
            return cmdTheme(args);
        case "clear":
        case "cls":
            return clearScreen();
        case "sudo":
            return print(
                "sudo: permission denied — nice try, but this shell has no root.",
                "err",
            );
        case "exit":
        case "logout":
        case "quit":
            return print(
                "There is no escape. Try 'open blog' instead.",
                "warn",
            );
        default:
            print(`command not found: ${command}. Try 'help'.`, "err");
    }
}

function execute(raw: string) {
    echoCommand(raw);
    const trimmed = raw.trim();
    if (!trimmed) {
        focusPrompt();
        return;
    }
    pushHistory(trimmed);
    activeCommand = trimmed;
    const [command, ...args] = trimmed.split(/\s+/);
    void dispatch(command.toLowerCase(), args).finally(focusPrompt);
}

async function typeLine(text: string, cls: string) {
    const out = output();
    if (!out) return;
    const row = document.createElement("div");
    row.className = "out" + (cls ? " " + cls : "");
    out.appendChild(row);
    for (const char of text) {
        row.textContent += char;
        scrollDown();
        await sleep(16);
    }
}

async function maybeBoot() {
    if (sessionStorage.getItem(BOOT_KEY)) return;
    sessionStorage.setItem(BOOT_KEY, "1");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    await typeLine("session started.", "dim");
    await sleep(120);
    await typeLine("Type 'help' to see available commands.", "dim");
    await sleep(120);
    await typeLine("Use 'ls blog' to browse posts.", "dim");
}

function applyPendingNavCommand() {
    let pending: string | null = null;
    try {
        pending = sessionStorage.getItem(NAV_KEY);
        if (pending) sessionStorage.removeItem(NAV_KEY);
    } catch {
        /* ignore */
    }
    if (!pending) return;

    const out = output();
    if (!out) return;

    // Entering a directory must not auto-print its contents (e.g. `ls` output,
    // `whoami`). Those are the canonical view for a direct load / refresh only.
    if (out.dataset.directory === "true") out.innerHTML = "";

    const row = document.createElement("div");
    row.className = "out cmd-line";
    row.appendChild(promptPrefix());
    row.appendChild(document.createTextNode(" " + pending));

    const existing = out.querySelector(":scope > .cmd-line");
    if (existing) existing.replaceWith(row);
    else out.prepend(row);
}

function onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event.key === "Enter") {
        event.preventDefault();
        const value = input.value;
        input.value = "";
        resizeInput(input);
        execute(value);
        return;
    }
    if (event.key === "ArrowUp") {
        event.preventDefault();
        recall(-1, input);
        return;
    }
    if (event.key === "ArrowDown") {
        event.preventDefault();
        recall(1, input);
        return;
    }
    if (event.key === "Tab") {
        event.preventDefault();
        complete(input);
        return;
    }
    if (event.key === "l" && event.ctrlKey) {
        event.preventDefault();
        clearScreen();
        return;
    }
    if (event.key === "c" && event.ctrlKey) {
        event.preventDefault();
        line(promptPrefix(), "^C");
        input.value = "";
        resizeInput(input);
    }
}

function initTerminal() {
    const input = promptInput();
    const terminal = document.getElementById("terminal");
    if (!input || !terminal || input.dataset.bound) return;
    input.dataset.bound = "true";

    loadHistory();
    applyPendingNavCommand();

    input.addEventListener("keydown", onKeyDown);
    input.addEventListener("input", () => resizeInput(input));

    terminal.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a, button, input")) return;
        focusPrompt();
    });

    document
        .querySelectorAll<HTMLButtonElement>(".terminal-chip")
        .forEach((chip) => {
            chip.addEventListener("click", () => {
                execute(chip.dataset.cmd ?? "");
                focusPrompt();
            });
        });

    document.addEventListener("focusout", () => {
        setTimeout(() => {
            const active = document.activeElement;
            if (!active || active === document.body) focusPrompt();
        }, 0);
    });

    resizeInput(input);
    focusPrompt();
    void loadPosts();
    void maybeBoot();
}

initTerminal();

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTerminal);
}

document.addEventListener("astro:page-load", initTerminal);
