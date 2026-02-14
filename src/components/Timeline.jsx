import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Star, MapPin, Music, Heart, Sparkles, Camera, Coffee, Gift, Calendar, ChevronDown } from 'lucide-react';

// Import local assets - User provided 1.jpeg to 9.jpeg
import img1 from '../assets/timeline/1.jpeg';
import img2 from '../assets/timeline/2.jpeg';
import img3 from '../assets/timeline/3.jpeg';
import img4 from '../assets/timeline/4.jpeg';
import img5 from '../assets/timeline/5.jpeg';
import img6 from '../assets/timeline/6.jpeg';
import img7 from '../assets/timeline/7.jpeg';
import img8 from '../assets/timeline/8.jpeg';
import img9 from '../assets/timeline/9.jpeg';
import img10 from '../assets/timeline/10.jpeg';
import mandalaPattern from '../assets/timeline/mandala_pattern.png';

const TIMELINE_EVENTS = [
    {
        year: "2025",
        month: "May",
        title: "The Beginning",
        description: "Bumble Match, and the whole night talking. Our worlds collided and a new era began. Every word felt like a spark igniting a flame that would burn forever.",
        date: "May 8th",
        subEvents: [
            { date: "May 13th", text: "The first time my eyes laid on you. Our first Idyll date. A moment etched in time." }
        ],
        icon: <Star className="w-6 h-6" />,
        photo: img1,
        color: "from-amber-200/20 to-orange-300/20"
    },
    {
        month: "June",
        title: "The Proposal",
        description: "Where we told exactly what we were feeling since that first match on May 8th. The bridge between destiny and today was built under the golden sun.",
        date: "June 14th",
        photo: img2,
        icon: <Heart className="w-6 h-6" />,
        color: "from-rose-200/20 to-pink-300/20",
        objectPosition: "top"
    },
    {
        month: "July",
        title: "Julayi Vibes",
        description: "The fun, the banter, the play dates. From art dates to IKEA to play dates, July with you was being a Julayi! Pure, unadulterated joy.",
        photo: img3,
        icon: <MapPin className="w-6 h-6" />,
        color: "from-sky-200/20 to-blue-300/20"
    },
    {
        month: "August",
        title: "Absolute Perfection",
        description: "Our F1 lego date, Jollywood, your home makeover, and our breathtaking candle light music concert. August was a symphony of perfect moments.",
        photo: img4,
        icon: <Music className="w-6 h-6" />,
        color: "from-indigo-200/20 to-purple-300/20"
    },
    {
        month: "September",
        title: "Saree uffff",
        description: "You in a saree for Onam... stole the entire month's memory just by that one thing. And Varkala! Every cliff and wave whispered your name.",
        photo: img5,
        icon: <Camera className="w-6 h-6" />,
        color: "from-teal-200/20 to-emerald-300/20"
    },
    {
        month: "October",
        title: "Sassy Babe",
        description: "Our first club night, where we danced our hearts out. I finally got my sassy babe to party with! The rhythm of the night was us.",
        photo: img6,
        icon: <Sparkles className="w-6 h-6" />,
        color: "from-violet-200/20 to-fuchsia-300/20"
    },
    {
        month: "November",
        title: "Your Month <3",
        description: "That red dress of yours uffffuffff. Petcafe, Panchvati, animal farm, the Airbnb date. Every moment was a celebration of you.",
        photo: img7,
        icon: <Coffee className="w-6 h-6" />,
        color: "from-red-200/20 to-rose-300/20"
    },
    {
        month: "December",
        title: "First Christmas",
        description: "Our first Christmas together <3 <3 Always special. Love how we celebrate everything together with light and love.",
        photo: img8,
        icon: <Star className="w-6 h-6" />,
        color: "from-green-200/20 to-emerald-300/20"
    },
    {
        year: "2026",
        month: "January",
        title: "Adventures & Squash",
        description: "Thank you for the Krishnagiri trip Love <3. Centering ourselves in nature. Also squash with you >>>> doing any activity with you >>>>",
        photo: img9,
        icon: <MapPin className="w-6 h-6" />,
        color: "from-cyan-200/20 to-blue-300/20"
    },
    {
        month: "February",
        title: "Season 1 Finale",
        description: "9 months in, 960 more to go. Filled with activities, fun, banter, and most importantly full of love. Our Ramayan is a masterpiece in the making.",
        photo: img10,
        icon: <Gift className="w-6 h-6" />,
        color: "from-gold-200/20 to-amber-300/20"
    }
];

const MemoryCard = ({ event, index }) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: false, margin: "-20%" });

    // Parallax effect for the image
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const yPara = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const rotatePara = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? 5 : -5]);
    const scalePara = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <div
            ref={cardRef}
            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center mb-32 md:mb-64 relative w-full`}
        >
            {/* Memory Card */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[50%] z-20"
            >
                <div className={`relative bg-white/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden group hover:shadow-accent/10 transition-shadow duration-700 bg-gradient-to-br ${event.color}`}>

                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                        <img src={mandalaPattern} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-8">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                                className="p-5 bg-primary rounded-3xl text-white shadow-xl shadow-primary/20"
                            >
                                {event.icon}
                            </motion.div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black text-accent tracking-[0.2em] uppercase">
                                        {event.month} {event.date || ''}
                                    </span>
                                    {event.year && (
                                        <span className="px-3 py-1 bg-accent/10 rounded-full text-[10px] font-black text-accent">
                                            {event.year}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-3xl md:text-5xl text-primary font-playfair italic leading-tight mt-1">
                                    {event.title}
                                </h3>
                            </div>
                        </div>

                        <p className="text-gray-700 font-lato text-lg md:text-2xl leading-relaxed mb-10 text-balance font-medium">
                            {event.description}
                        </p>

                        {event.subEvents && (
                            <div className="space-y-4 mb-10">
                                {event.subEvents.map((sub, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex gap-5 items-start bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm"
                                    >
                                        <Calendar className="w-6 h-6 text-accent mt-1 shrink-0" />
                                        <p className="text-gray-800 font-lato italic text-lg">
                                            <span className="font-black text-primary not-italic mr-3">{sub.date}:</span>
                                            {sub.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Parallax Image Container */}
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10] md:aspect-auto md:h-[400px]">
                            <motion.img
                                style={{ y: yPara, scale: scalePara, rotate: rotatePara, objectPosition: event.objectPosition || 'center' }}
                                src={event.photo}
                                alt={event.title}
                                className="w-full h-full object-cover transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute bottom-6 left-8 text-white font-lato font-bold tracking-[0.2em] uppercase text-xs"
                            >
                                Memory Capture #{index + 1}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Central Line Connector */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 justify-center items-center h-full z-10 w-0">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    className="w-8 h-8 bg-accent rounded-full border-[6px] border-romantic-bg shadow-[0_0_30px_rgba(var(--accent-rgb),0.8)] z-30"
                />
            </div>

            <div className="hidden lg:block w-[50%]" />
        </div>
    );
};

const Timeline = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const pathScale = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#FFFBF5] py-32 md:py-64 px-6 md:px-12 overflow-hidden selection:bg-accent selection:text-white">
            {/* Background decorative mandalas */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
                <img src={mandalaPattern} alt="" className="w-full h-full object-cover scale-150 animate-slow-spin" />
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-64 md:mb-96 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <Sparkles className="w-16 h-16 text-accent mx-auto" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 100, letterSpacing: "1em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[12rem] text-primary font-playfair italic mb-8 leading-none drop-shadow-sm"
                >
                    Ramayan
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 2 }}
                >
                    <p className="text-xl md:text-3xl text-accent font-lato uppercase tracking-[0.5em] font-black mb-16">
                        Season One: Divine Beginnings
                    </p>
                    <ChevronDown className="w-10 h-10 text-accent/30 mx-auto animate-bounce mt-10" />
                </motion.div>
            </div>

            {/* The Vertical Path - Golden Thread */}
            <div className="absolute left-1/2 top-[1200px] bottom-[1200px] w-1.5 md:w-2 -translate-x-1/2 z-0 hidden lg:block">
                <div className="h-full w-full bg-primary/5 rounded-full" />
                <motion.div
                    style={{ scaleY: pathScale }}
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent/40 via-accent to-accent/40 origin-top rounded-full shadow-[0_0_30px_rgba(212,175,55,1)]"
                />
            </div>

            {/* Timeline Events */}
            <div className="max-w-[1400px] mx-auto relative z-10">
                {TIMELINE_EVENTS.map((event, index) => (
                    <MemoryCard key={index} event={event} index={index} />
                ))}
            </div>

            {/* Finale Section */}
            <div className="max-w-6xl mx-auto mt-64 mb-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-primary p-12 md:p-32 rounded-[4rem] text-center overflow-hidden shadow-[0_64px_128px_-32px_rgba(var(--primary-rgb),0.5)]"
                >
                    {/* Decorative pattern for finale */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                        <img src={mandalaPattern} alt="" className="w-full h-full object-cover scale-150 rotate-45" />
                    </div>

                    <Heart className="w-24 h-24 text-accent mx-auto mb-16 fill-accent shadow-[0_0_50px_rgba(212,175,55,0.8)] animate-pulse" />

                    <div className="space-y-12 text-white font-playfair italic text-3xl md:text-6xl leading-tight">
                        <p className="drop-shadow-lg">"Season 1 has been a masterpiece of joy, fun, and the purest love."</p>
                        <p className="text-accent drop-shadow-lg">"Let's write a series that lasts for lifetimes."</p>
                        <p className="not-italic font-black text-white text-6xl md:text-[8rem] mt-24 tracking-tighter uppercase drop-shadow-2xl">
                            I love you Sita
                        </p>
                    </div>

                    <div className="mt-32 pt-16 border-t border-white/10 text-white/40 font-lato uppercase tracking-[1em] text-sm font-black">
                        Episode 1 concluded • Many more to come
                    </div>
                </motion.div>
            </div>

            {/* Scroll Progress Indicator for User */}
            <div className="fixed bottom-12 right-12 z-50 flex items-center gap-4">
                <div className="h-1 w-32 bg-primary/10 rounded-full relative overflow-hidden">
                    <motion.div
                        style={{ scaleX: scrollYProgress }}
                        className="absolute inset-0 bg-accent origin-left"
                    />
                </div>
                <span className="text-primary font-black text-[10px] tracking-widest uppercase">The Journey</span>
            </div>
        </div>
    );
};

export default Timeline;
