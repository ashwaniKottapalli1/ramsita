export const CONFIG = {
    // Paste your YouTube video URL here
    // Example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    youtubeMusicUrl: "https://www.youtube.com/watch?v=fV4x7OCqFLA&list=RDfV4x7OCqFLA&start_radio=1&pp=ygUQbXkgZGlsIGdvZXMgbW1tbaAHAQ%3D%3D",

    // Custom confetti sound URL (Optional)
    // If provided, it will play this instead of the synthesized pop
    confettiSoundUrl: "https://www.youtube.com/watch?v=zBzTS9kk5So",

    // You can also change the countdown date here
    startDate: '2025-05-08T00:00:00',

    // Theme colors (if you want to nudge them slightly)
    colors: {
        primary: "#7F1D1D",
        accent: "#D4AF37",
        romanticBg: "#FFFBF0"
    }
};

/**
 * Helper to extract YouTube ID from various URL formats
 */
export const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};
