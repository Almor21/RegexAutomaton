import React, { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';

function Table() {
    const [open, setOpen] = useState(false);
    const closeDiv = useRef<HTMLDivElement>(null);
    const openDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const run = async () => {
            if (!(closeDiv.current && openDiv.current)) return;

            if (open) {
                await animate(
                    closeDiv.current,
                    {
                        x: '110%'
                    },
                    {
                        type: 'tween'
                    }
                );
                await animate(
                    openDiv.current,
                    {
                        x: '0%'
                    },
                    {
                        type: 'tween'
                    }
                );
            } else {
                await animate(
                    openDiv.current,
                    {
                        x: '110%'
                    },
                    {
                        type: 'tween'
                    }
                );
                await animate(
                    closeDiv.current,
                    {
                        x: '0%'
                    },
                    {
                        type: 'tween'
                    }
                );
            }
        };

        run();
    }, [open]);

    return (
        <>
            <motion.div
                ref={closeDiv}
                className="absolute top-1/2 -right-[1.5px] z-10 w-10 h-5/6 flex justify-center items-center bg-[var(--color-300)] rounded-l-3xl box-content border-[1.5px] border-[var(--color-700)] cursor-pointer"
                style={{
                    y: '-50%'
                }}
                onClick={() => setOpen(true)}
            >
                <span className="inline-block text-[var(--color-900)] font-medium -rotate-90">
                    Table
                </span>
            </motion.div>
            <motion.div
                ref={openDiv}
                className="absolute top-1/2 right-2 z-10 w-52 h-[95%] grid grid-rows-[auto_1fr] bg-[var(--color-300)] rounded-xl"
                style={{
                    x: '110%',
                    y: '-50%'
                }}
                onClick={() => setOpen(false)}
            >
                <div className="grid grid-cols-[1fr_auto] items-center">
                    <h1 className="text-white py-1 row-start-1 col-start-1 col-end-3 text-center border-b-2 border-white">
                        Table
                    </h1>
                    <div
                        className="relative inline-block w-4 ml-3 row-start-1 col-start-1 cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <span className="absolute top-1/2 left-0 -translate-y-1/2 inline-block bg-white w-full h-1 rounded-full -rotate-45" />
                        <span className="absolute top-1/2 left-0 -translate-y-1/2 inline-block bg-white w-full h-1 rounded-full rotate-45" />
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default Table;
