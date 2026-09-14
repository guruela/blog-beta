const profilePicture = document.querySelector<HTMLImageElement>('[data-profile-picture]');

if (profilePicture && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const pictures = [
        { src: '/pfp/pfp1.jpg', position: '65% 35%' },
        { src: '/pfp/pfp2.jpg', position: '35% 70%' },
        { src: '/pfp/pfp3.png', position: '50% 30%' },
    ];
    let currentPicture = 0;

    for (const picture of pictures.slice(1)) {
        const preload = new Image();
        preload.src = picture.src;
    }

    window.setInterval(() => {
        profilePicture.classList.add('is-transitioning');

        window.setTimeout(() => {
            currentPicture = (currentPicture + 1) % pictures.length;
            profilePicture.src = pictures[currentPicture].src;
            profilePicture.style.objectPosition = pictures[currentPicture].position;
        }, 350);
    }, 3500);

    profilePicture.addEventListener('animationend', () => {
        profilePicture.classList.remove('is-transitioning');
    });
}
