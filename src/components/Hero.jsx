import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { intervalToDuration } from 'date-fns';
import { Heart, AlertTriangle } from 'lucide-react';
import Confetti from 'react-confetti';
import { CONFIG } from '../config';

const Hero = ({ onAccept, isMuted, onConfetti }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [showImposterModal, setShowImposterModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const cardRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const startDate = new Date(CONFIG.startDate);


  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    const timer = setInterval(() => {
      const now = new Date();
      const duration = intervalToDuration({ start: startDate, end: now });
      setTimeLeft(duration);
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);

  const noButtonRef = useRef(null);

  const handleNoHover = () => {
    if (!cardRef.current || !noButtonRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const btnRect = noButtonRef.current.getBoundingClientRect();

    // We want to keep the button center within the card
    // x and y are offsets from its initial layout position
    const padding = 20;

    // Calculate the max allowed offset in each direction
    // Browsers might have different initial positions, but relative to card center:
    const safeW = (cardRect.width / 2) - (btnRect.width / 2) - padding;
    const safeH = (cardRect.height / 2) - (btnRect.height / 2) - padding;

    const newX = (Math.random() - 0.5) * safeW * 2;
    const newY = (Math.random() - 0.5) * safeH * 2;

    setNoButtonPos({ x: newX, y: newY });
  };

  const handleNoClick = () => {
    setIsShaking(true);
    setShowImposterModal(true);
    setTimeout(() => {
      setShowImposterModal(false);
      setIsShaking(false);
    }, 3000);
  };

  const handleYesClick = () => {
    if (onConfetti) onConfetti();
    setShowConfetti(true);
    setTimeout(() => {
      onAccept();
    }, 4000);
  };

  return (
    <div className={`relative h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-500 ${isShaking ? 'animate-shake' : ''}`}>
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/garden.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
      </div>

      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={800} gravity={0.15} colors={['#D4AF37', '#7F1D1D', '#FFFBF0']} />}

      {/* Decorative Mandala - Hidden on mobile for space */}
      <motion.div
        initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
        animate={{ opacity: 0.1, rotate: 360, scale: 1 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -left-32 w-64 h-64 md:w-96 md:h-96 bg-pattern rounded-full hidden sm:block"
      />

      {/* Timer Section - Compact for Mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-4 md:mb-8 text-center"
      >
        <div className="bg-black/40 backdrop-blur-xl py-3 px-6 md:py-6 md:px-12 rounded-2xl md:rounded-[2rem] border border-accent/40 shadow-2xl">
          <p className="text-accent font-playfair text-sm md:text-xl mb-1 md:mb-2 tracking-wider uppercase font-black text-crisp">
            Together since
          </p>
          <div className="flex justify-center gap-3 md:gap-8 text-white font-lato font-black text-lg md:text-4xl">
            {[
              { label: 'Mos', val: timeLeft.months },
              { label: 'Days', val: timeLeft.days },
              { label: 'Hrs', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds }
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center min-w-[35px] md:min-w-[60px]">
                <span className="text-glow drop-shadow-xl tabular-nums leading-none">{unit.val || 0}</span>
                <span className="text-[8px] md:text-xs uppercase tracking-tighter text-accent font-black mt-1 opacity-80">{unit.label}</span>
              </div>
            ))}
          </div>
          <p className="text-accent/60 font-lato text-[8px] md:text-[10px] mt-2 md:mt-4 tracking-widest uppercase opacity-70">
            May 8th, 2025
          </p>
        </div>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 bg-black/40 backdrop-blur-2xl p-6 md:p-16 rounded-3xl md:rounded-[3rem] border-2 border-accent/50 max-w-2xl w-full text-center shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col items-center justify-center aspect-[4/5] sm:aspect-auto"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 md:mb-8"
        >
          <Heart className="w-12 h-12 md:w-20 md:h-20 text-accent fill-accent/40 drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]" />
        </motion.div>

        <h1 className="text-3xl md:text-6xl text-white mb-6 md:mb-10 font-playfair italic font-medium leading-tight text-crisp">
          My Dearest Sita, <br />
          <span className="text-2xl md:text-5xl not-italic font-black text-accent drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] block mt-2 uppercase tracking-tight">Will you be my Valentine?</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 mt-4 md:mt-8 w-full">
          {/* YES Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 50px rgba(212, 175, 55, 0.9)",
              backgroundColor: "#D4AF37",
              color: "#7F1D1D"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYesClick}
            className="group relative px-12 py-4 md:px-20 md:py-6 bg-accent/90 text-primary font-playfair font-black text-2xl md:text-4xl rounded-full shadow-2xl transition-all cursor-pointer overflow-hidden border-2 border-accent/50 w-full sm:w-auto"
          >
            <span className="relative z-10">YES</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          </motion.button>

          {/* NO Button - Bounded Roaming */}
          <motion.div
            animate={{ x: noButtonPos.x, y: noButtonPos.y }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onMouseEnter={handleNoHover}
            className="w-full sm:w-auto"
          >
            <button
              ref={noButtonRef}
              onClick={handleNoClick}
              className="px-8 py-3 md:px-12 md:py-5 bg-white/5 border border-white/20 text-white/60 font-playfair text-xl md:text-2xl rounded-full cursor-pointer hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm shadow-xl w-full sm:w-auto"
            >
              No
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Mandala Bottom */}
      <motion.div
        initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
        animate={{ opacity: 0.1, rotate: -360, scale: 1 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -right-32 w-64 h-64 md:w-96 md:h-96 bg-pattern rounded-full hidden sm:block"
      />

      {/* Imposter Modal */}
      <AnimatePresence>
        {showImposterModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/95 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              className="bg-primary/95 text-white p-8 md:p-12 rounded-3xl md:rounded-[2rem] border-4 border-red-500 max-w-sm md:max-w-lg text-center shadow-[0_0_100px_rgba(255,0,0,0.6)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none" />
              <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 text-red-500 animate-bounce" />
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-playfair tracking-tight">⚠ IMPOSTER DETECTED ⚠</h2>
              <div className="space-y-2 md:space-y-4">
                <p className="text-lg md:text-2xl font-lato leading-relaxed">The real Sita would never say no to her Ram.</p>
                <div className="h-px w-16 md:w-24 bg-red-500/50 mx-auto my-4 md:my-6" />
                <p className="text-2xl md:text-4xl font-black italic text-red-500 uppercase tracking-widest">Are you Ravana?</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
