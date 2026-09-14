function initCopyButtons() {
    const preBlocks = document.querySelectorAll('.markdown-content pre');
    preBlocks.forEach((pre) => {
        if (pre.dataset.copyInit) return;
        pre.dataset.copyInit = 'true';

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        btn.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.innerText : pre.textContent || '';
            try {
                await navigator.clipboard.writeText(text);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
            } catch {
                btn.textContent = 'Failed';
            }
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 2000);
        });

        wrapper.appendChild(btn);
    });
}

initCopyButtons();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
}

document.addEventListener('astro:page-load', initCopyButtons);
