import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, Lock } from 'lucide-react';

const GRID_SIZE = 15;

const CROSSWORD_DATA = {
    down: [
        { id: 1, answer: "GREECE", row: 0, col: 5, clue: "dream destination" },
        { id: 2, answer: "VARKALA", row: 1, col: 2, clue: "our first big trip" },
        { id: 4, answer: "FINALLY", row: 6, col: 9, clue: "title of your poem shared on 14th June" },
        { id: 6, answer: "LITCHI", row: 9, col: 5, clue: "your favourite fruit" },
    ],
    across: [
        { id: 3, answer: "ROSE", row: 3, col: 2, clue: "my first gift" },
        { id: 5, answer: "PANCHVATI", row: 7, col: 1, clue: "our own secret place" },
        { id: 7, answer: "IDYLL", row: 10, col: 5, clue: "our first date place" },
    ],
};

const Crossword = ({ onSuccess }) => {
    const [grid, setGrid] = useState(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ char: null, active: false, number: null })));
    const [userInputs, setUserInputs] = useState({});
    const [direction, setDirection] = useState('across');
    const [activeClue, setActiveClue] = useState(null);
    const inputRefs = useRef({});

    // Helper to find clue for a cell
    const getClueForCell = (r, c, dir) => {
        return [...CROSSWORD_DATA.down, ...CROSSWORD_DATA.across].find(word => {
            const isDown = CROSSWORD_DATA.down.includes(word);
            const wordDir = isDown ? 'down' : 'across';
            if (wordDir !== dir) return false;

            for (let i = 0; i < word.answer.length; i++) {
                const wr = isDown ? word.row + i : word.row;
                const wc = isDown ? word.col : word.col + i;
                if (wr === r && wc === c) return true;
            }
            return false;
        });
    };

    useEffect(() => {
        const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ char: null, active: false, number: null }));

        [...CROSSWORD_DATA.down, ...CROSSWORD_DATA.across].forEach(word => {
            const isDown = CROSSWORD_DATA.down.includes(word);
            for (let i = 0; i < word.answer.length; i++) {
                const r = isDown ? word.row + i : word.row;
                const c = isDown ? word.col : word.col + i;
                if (newGrid[r] && newGrid[r][c]) {
                    newGrid[r][c] = {
                        ...newGrid[r][c],
                        active: true,
                        correctChar: word.answer[i],
                        number: i === 0 ? word.id : (newGrid[r][c].number || null)
                    };
                }
            }
        });
        setGrid(newGrid);
    }, []);

    const handleCellClick = (r, c) => {
        const cell = grid[r][c];
        if (!cell.active) return;

        const canGoAcross = grid[r][c + 1]?.active || grid[r][c - 1]?.active;
        const canGoDown = grid[r + 1]?.[c]?.active || grid[r - 1]?.[c]?.active;

        let nextDir = direction;
        if (canGoAcross && canGoDown) {
            nextDir = direction === 'across' ? 'down' : 'across';
            setDirection(nextDir);
        } else if (canGoAcross) {
            nextDir = 'across';
            setDirection('across');
        } else if (canGoDown) {
            nextDir = 'down';
            setDirection('down');
        }

        setActiveClue(getClueForCell(r, c, nextDir));
    };

    const handleInput = (r, c, val) => {
        const char = val.toUpperCase().slice(-1);
        if (!char.match(/[A-Z]/) && char !== '') return;

        const newInput = { ...userInputs, [`${r}-${c}`]: char };
        setUserInputs(newInput);

        if (char !== '') {
            const nextNode = findNextNode(r, c, direction);
            if (nextNode) {
                inputRefs.current[`${nextNode.r}-${nextNode.c}`]?.focus();
                setActiveClue(getClueForCell(nextNode.r, nextNode.c, direction));
            }
        }
        checkCompletion(newInput);
    };

    const findNextNode = (r, c, dir) => {
        if (dir === 'across' && grid[r][c + 1]?.active) return { r, c: c + 1 };
        if (dir === 'down' && grid[r + 1]?.[c]?.active) return { r: r + 1, c };
        return null;
    };

    const handleKeyDown = (r, c, e) => {
        if (e.key === 'Backspace' && !userInputs[`${r}-${c}`]) {
            const prevNode = findPrevNode(r, c, direction);
            if (prevNode) {
                inputRefs.current[`${prevNode.r}-${prevNode.c}`]?.focus();
                setActiveClue(getClueForCell(prevNode.r, prevNode.c, direction));
            }
        } else if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            const dirMap = { ArrowRight: 'across', ArrowLeft: 'across', ArrowUp: 'down', ArrowDown: 'down' };
            const newDir = dirMap[e.key];
            setDirection(newDir);

            let nr = r, nc = c;
            if (e.key === 'ArrowRight') nc++;
            if (e.key === 'ArrowLeft') nc--;
            if (e.key === 'ArrowDown') nr++;
            if (e.key === 'ArrowUp') nr--;

            if (grid[nr]?.[nc]?.active) {
                inputRefs.current[`${nr}-${nc}`]?.focus();
                setActiveClue(getClueForCell(nr, nc, newDir));
            }
        }
    };

    const findPrevNode = (r, c, dir) => {
        if (dir === 'across' && grid[r][c - 1]?.active) return { r, c: c - 1 };
        if (dir === 'down' && grid[r - 1]?.[c]?.active) return { r: r - 1, c };
        return null;
    };

    const checkCompletion = (inputs) => {
        const allCorrect = [...CROSSWORD_DATA.down, ...CROSSWORD_DATA.across].every(word => {
            const isDown = CROSSWORD_DATA.down.includes(word);
            return word.answer.split('').every((char, i) => {
                const r = isDown ? word.row + i : word.row;
                const c = isDown ? word.col : word.col + i;
                return inputs[`${r}-${c}`] === char;
            });
        });

        if (allCorrect) {
            setTimeout(() => onSuccess(), 1000);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center p-2 md:p-6 bg-romantic-bg overflow-hidden relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-pattern" />

            {/* Header - Extremely Compact */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-2 md:mb-6 relative z-10 shrink-0"
            >
                <div className="flex justify-center mb-1">
                    <Lock className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" />
                </div>
                <h2 className="text-xl md:text-3xl text-primary font-playfair italic mb-1 leading-tight">Wait... this portal is only for my Sita.</h2>
                <p className="text-[10px] md:text-sm text-accent font-lato uppercase tracking-[0.2em] font-black">Solve our memories to enter.</p>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-8 items-center lg:items-stretch justify-center w-full max-w-6xl h-full max-h-[80vh] relative z-10 overflow-hidden">

                {/* Crossword Grid Container - Deep Content & High Contrast */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid gap-0 bg-primary p-2 md:p-3 rounded-2xl shadow-[0_32px_64px_-16px_rgba(127,29,29,0.4)] border-4 border-accent/30 overflow-hidden shrink-0"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        gridAutoRows: '1fr',
                        width: 'min(90vw, 75vh, 600px)',
                        aspectRatio: '1/1'
                    }}
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) => (
                            <div key={`${r}-${c}`} className="relative w-full h-full min-h-0 min-w-0">
                                {cell.active ? (
                                    <>
                                        {cell.number && (
                                            <span className="absolute top-1 left-1 text-[7px] md:text-[12px] font-black text-primary/40 z-10 leading-none pointer-events-none">
                                                {cell.number}
                                            </span>
                                        )}
                                        <input
                                            ref={el => inputRefs.current[`${r}-${c}`] = el}
                                            type="text"
                                            maxLength={1}
                                            value={userInputs[`${r}-${c}`] || ''}
                                            onFocus={() => handleCellClick(r, c)}
                                            onChange={(e) => handleInput(r, c, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(r, c, e)}
                                            className={`w-full h-full text-center text-xs md:text-2xl font-black rounded-none border-none outline-none shadow-[inset_0_0_0_1px_rgba(127,29,29,0.05)] transition-all duration-200 focus:ring-2 focus:ring-accent focus:z-20
                                                ${userInputs[`${r}-${c}`]
                                                    ? (userInputs[`${r}-${c}`] === cell.correctChar
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-700 animate-shake')
                                                    : 'bg-white hover:bg-gray-50'
                                                }`}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-primary/40 backdrop-blur-sm shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]" />
                                )}
                            </div>
                        ))
                    )}
                </motion.div>

                {/* Clues Pane - Premium Glass Design */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 w-full max-w-sm bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/50 overflow-y-auto custom-scrollbar lg:max-h-full"
                >
                    <h3 className="text-2xl md:text-3xl text-primary font-playfair italic mb-8 border-b border-primary/10 pb-4">Solve our memories</h3>

                    <div className="space-y-10">
                        {['ACROSS', 'DOWN'].map((dir) => (
                            <div key={dir}>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-px bg-accent/30 flex-1" />
                                    <h4 className="text-xs font-black text-accent tracking-[0.3em] uppercase">{dir}</h4>
                                    <div className="h-px bg-accent/30 flex-1" />
                                </div>
                                <div className="space-y-6">
                                    {(dir === 'ACROSS' ? CROSSWORD_DATA.across : CROSSWORD_DATA.down).map((clue) => (
                                        <motion.div
                                            key={`${dir}-${clue.id}`}
                                            whileHover={{ x: 5 }}
                                            className="flex gap-4 group cursor-default"
                                        >
                                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors shadow-sm
                                                ${activeClue?.id === clue.id ? 'bg-primary text-white scale-110' : 'bg-accent/10 text-accent group-hover:bg-accent/20'}`}>
                                                {clue.number || clue.id}
                                            </span>
                                            <p className={`text-base md:text-lg leading-snug transition-colors font-medium
                                                ${activeClue?.id === clue.id ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
                                                {clue.clue}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-primary/5 text-center">
                        <p className="text-[10px] md:text-xs text-primary/40 font-black uppercase tracking-[0.2em] animate-pulse">
                            Success unlocks the final chapter...
                        </p>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default Crossword;
