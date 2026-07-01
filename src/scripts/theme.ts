function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Apply initial theme from localStorage or system preference
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Ensure the theme is set immediately without waiting for DOMContentLoaded if possible
initTheme();

// Also run on DOMContentLoaded just in case elements weren't ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
}

// Support for Astro view transitions
document.addEventListener('astro:page-load', initTheme);
