import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { validate } from '../utils/regex';

function InputRegex({
    onChangeRegex,
    onChangeStr
}: {
    onChangeRegex: (v: string) => void;
    onChangeStr: (v: string) => void;
}) {
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const controls = useAnimation();

    const sendRegex = () => {
        controls.stop();
        controls.set({
            outline: 'none'
        });

        if (validate(regex)) {
            onChangeRegex(regex);
        } else {
            controls.set({
                outline: '2px solid #b91c1c'
            });
            controls.start(
                {
                    outline: 'none'
                },
                {
                    delay: 1,
                    duration: 0.8
                }
            );
        }
    };

    const sendStr = () => {
        onChangeStr(str);
    };

    return (
        <div className="max-w-[1280px] w-full grid grid-cols-[auto_1fr_auto] gap-8">
            <img
                src="/Logo.svg"
                alt="Logo Image"
                className="filter invert drop-shadow-[2px_4px_4px_rgba(0,0,0,0.6)]"
                width={100}
                height={100}
            />
            <div className="w-full flex flex-col gap-3 justify-center">
                <motion.input
                    className="w-full px-4 py-1 bg-[var(--color-900)] focus:outline-none rounded-lg shadow-[2px_4px_4px_rgba(0,0,0,0.6)] placeholder:font-light placeholder:italic placeholder:text-sm"
                    animate={controls}
                    placeholder="Regular Expression"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                />
                <input
                    className="px-4 py-1 bg-[var(--color-900)] focus:outline-none rounded-lg shadow-[2px_4px_4px_rgba(0,0,0,0.6)] placeholder:font-light placeholder:italic placeholder:text-sm"
                    placeholder="String"
                    value={str}
                    onChange={(e) => setStr(e.target.value)}
                />
            </div>
            <div className="flex flex-col justify-evenly items-center">
                <button
                    className="w-full bg-[var(--color-900)] text-[var(--color-100)] shadow-[2px_4px_4px_rgba(0,0,0,0.6)] transition-all hover:bg-gray-300 active:bg-[var(--color-100)] active:text-[var(--color-900)]"
                    onClick={() => sendRegex()}
                >
                    Send
                </button>
                <button
                    className="w-full bg-[var(--color-900)] text-[var(--color-100)] shadow-[2px_4px_4px_rgba(0,0,0,0.6)] transition-all hover:bg-gray-300 active:bg-[var(--color-100)] active:text-[var(--color-900)]"
                    onClick={() => sendStr()}
                >
                    Run
                </button>
            </div>
        </div>
    );
}

export default InputRegex;
