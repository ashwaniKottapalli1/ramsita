import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import Hero from './components/Hero';
import Crossword from './components/Crossword';
import Timeline from './components/Timeline';
import { Calendar, Heart, MapPin, Music, Star, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { CONFIG, getYouTubeId } from './config';

const App = () => {
  const [stage, setStage] = useState(1); // 1: Proposal, 2: Crossword, 3: Timeline
  const [isMuted, setIsMuted] = useState(false);
  const musicPlayerRef = useRef(null);
  const sfxPlayerRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Check for stage in URL: ?stage=3
    const params = new URLSearchParams(window.location.search);
    const urlStage = parseInt(params.get('stage'));
    if (urlStage && urlStage >= 1 && urlStage <= 3) {
      setStage(urlStage);
    }

    const handleFirstInteraction = () => {
      if (!hasInteracted.current) {
        if (musicPlayerRef.current && !isMuted) musicPlayerRef.current.playVideo();
        hasInteracted.current = true;
      }
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [isMuted]);

  const timelineData = [
    { title: "The Beginning", date: "May 8th, 2025", description: "The day our worlds collided and everything changed. A new epoch in our own Ramayan began.", icon: <Star className="w-5 h-5" /> },
    { title: "The Cliffs of Varkala", date: "First Big Adventure", description: "Exploring the red cliffs and the azure sea, finding ourselves in the rhythm of the waves.", icon: <MapPin className="w-5 h-5" /> },
    { title: "Resonance", date: "June 14th", description: "When you shared 'Finally'. Words that built a bridge between destiny and today.", icon: <Music className="w-5 h-5" /> },
    { title: "Our Panchvati", date: "The Secret Haven", description: "Building a sanctuary where time stops and only 'We' exists. Our own paradise.", icon: <Heart className="w-5 h-5" /> },
    { title: "The Eternal Chapter", date: "Today & Forever", description: "Every morning is a prayer, every evening a celebration. To our Season 1 and beyond.", icon: <Calendar className="w-5 h-5" /> },
  ];

  const playSuccessChime = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 1);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.log('Audio error');
    }
  };

  const playConfettiSound = () => {
    if (isMuted) return;

    const sfxId = getYouTubeId(CONFIG.confettiSoundUrl);

    // Duck music volume
    if (musicPlayerRef.current) {
      musicPlayerRef.current.setVolume(20);
    }

    if (sfxId && sfxPlayerRef.current) {
      sfxPlayerRef.current.setVolume(100);
      sfxPlayerRef.current.seekTo(0);
      sfxPlayerRef.current.playVideo();
    } else if (CONFIG.confettiSoundUrl) {
      const audio = new Audio(CONFIG.confettiSoundUrl);
      audio.volume = 1.0;
      audio.play().catch(e => console.log('SFX blocked'));
    }

    // Restore music volume after 4 seconds
    setTimeout(() => {
      if (musicPlayerRef.current && !isMuted) {
        musicPlayerRef.current.setVolume(100);
      }
    }, 4000);
  };

  const onMusicReady = (event) => {
    musicPlayerRef.current = event.target;
    if (!isMuted && hasInteracted.current) {
      event.target.playVideo();
    }
  };

  const onSfxReady = (event) => {
    sfxPlayerRef.current = event.target;
    event.target.mute();
  };

  const toggleMute = () => {
    if (musicPlayerRef.current) {
      if (isMuted) {
        musicPlayerRef.current.unMute();
        musicPlayerRef.current.playVideo();
        if (sfxPlayerRef.current) sfxPlayerRef.current.unMute();
      } else {
        musicPlayerRef.current.mute();
        if (sfxPlayerRef.current) sfxPlayerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleCrosswordSuccess = () => {
    playSuccessChime();
    setStage(3);
  };

  const musicId = getYouTubeId(CONFIG.youtubeMusicUrl);
  const sfxId = getYouTubeId(CONFIG.confettiSoundUrl);

  const musicOpts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: musicId,
    },
  };

  const sfxOpts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      loop: 0,
    },
  };

  return (
    <div className={`bg-romantic-bg min-h-screen selection:bg-accent selection:text-primary ${stage === 3 ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      {/* Background Music Player */}
      <div className="hidden absolute">
        {musicId && (
          <YouTube videoId={musicId} opts={musicOpts} onReady={onMusicReady} />
        )}
      </div>

      {/* SFX Player */}
      <div className="hidden absolute">
        {sfxId && (
          <YouTube videoId={sfxId} opts={sfxOpts} onReady={onSfxReady} />
        )}
      </div>

      {/* Global Audio Control */}
      <div className="fixed top-6 right-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-4 bg-black/30 backdrop-blur-xl border border-white/20 rounded-full text-accent shadow-2xl hover:bg-black/50 transition-all font-black"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
        </motion.button>
      </div>

      {/* Global Decorative Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-pattern z-0" />

      <AnimatePresence mode="wait">
        {stage === 1 && (
          <motion.div
            key="stage1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.2 }}
            className="relative z-10"
          >
            <Hero
              onAccept={() => setStage(2)}
              isMuted={isMuted}
              onConfetti={playConfettiSound}
            />
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            key="stage2"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.2 }}
            className="relative z-10"
          >
            <Crossword onSuccess={() => {
              playSuccessChime();
              setStage(3);
            }} />
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div
            key="stage3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10"
          >
            <Timeline />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
