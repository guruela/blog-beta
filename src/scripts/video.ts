function initVideoPlayers() {
    const videoExtensions = ['mov', 'mp4', 'webm', 'ogg', 'm4v'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'];

    const images = document.querySelectorAll('.markdown-content img');
    images.forEach((img) => {
        const src = img.getAttribute('src') || '';
        const ext = src.split('.').pop()?.toLowerCase() || '';

        if (!videoExtensions.includes(ext) && !audioExtensions.includes(ext)) return;

        const isVideo = videoExtensions.includes(ext);
        const container = img.parentElement;

        const player = document.createElement(isVideo ? 'video' : 'audio');
        player.controls = true;
        player.preload = 'metadata';
        if (isVideo) {
            player.style.width = '100%';
            player.style.height = 'auto';
        }

        const source = document.createElement('source');
        source.src = src;
        player.appendChild(source);

        if (isVideo) {
            player.addEventListener('loadedmetadata', () => {
                player.currentTime = 0.1;
            });
            player.addEventListener('seeked', () => {
                player.pause();
            });
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'media-player';

        wrapper.appendChild(player);

        if (container) {
            container.replaceChild(wrapper, img);
        } else {
            img.replaceWith(wrapper);
        }
    });
}

initVideoPlayers();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoPlayers);
}

document.addEventListener('astro:page-load', initVideoPlayers);
