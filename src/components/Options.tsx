import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function Options({
    active,
    value,
    onChange
}: {
        active: boolean;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 grid grid-cols-3 bg-[var(--color-500)] border-2 border-[var(--color-700)] shadow-[2px_4px_4px_rgba(0,0,0,0.6)] text-xs rounded-xl overflow-hidden">
            {['NFA', 'Unoptimized - DFA', 'Minimized - DFA'].map((op, index) => (
                <div
                    key={index}
                    className="relative w-44 text-center font-semibold cursor-pointer"
                    onClick={() => onChange(index)}
                >
                    <motion.span
                        className="relative z-20"
                        animate={{
                            color: active && value === index ? '#000' : '#FFF'
                        }}
                    >
                        {op}
                    </motion.span>
                </div>
            ))}
            <AnimatePresence>
                {active && (
                    <motion.span
                        className="absolute inline-block w-44 h-full top-0 left-0 bg-[var(--color-900)] z-10 cursor-pointer"
                        initial={{
                            opacity: 0,
                            x: 176 * value
                        }}
                        animate={{
                            opacity: 1,
                            x: 176 * value
                        }}
                        transition={{
                            type: 'tween'
                        }}
                        exit={{
                            opacity: 0
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Options;
