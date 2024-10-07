import React, { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';

interface PropertiesProps {
    alphabet: string[];
    initialState: string | null;
    finalState: string[];
    totalStates: number;
    transitions: { [key: string]: { [key: string]: string[] } };
    option: number;
    str: string;
}

const Properties: React.FC<PropertiesProps> = ({ alphabet, initialState, totalStates,  finalState , option, str,  transitions }) => {
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
                        x: '-110%'
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
                        x: '-110%'
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
                className="absolute top-1/2 -left-[1.5px] z-10 w-10 h-5/6 flex justify-center items-center bg-[var(--color-300)] rounded-r-3xl box-content border-[1.5px] border-[var(--color-700)] cursor-pointer"
                style={{
                    y: '-50%'
                }}
                onClick={() => setOpen(true)}
            >
                <span className="inline-block text-[var(--color-900)] font-medium rotate-90">
                    Properties
                </span>
            </motion.div>
            <motion.div
                ref={openDiv}
                className="absolute top-1/2 left-2 z-10 w-64 h-[95%] grid grid-rows-[auto_1fr] bg-[var(--color-300)] rounded-xl p-4 shadow-md"
                style={{
                    x: '-110%',
                    y: '-50%'
                }}
                onClick={() => setOpen(false)}
            >
                <div className="grid grid-cols-[1fr_auto] items-center">
                    <h1 className="text-white py-1 row-start-1 col-start-1 col-end-3 text-center border-b-2 border-white">
                        Properties
                    </h1>
                    <div
                        className="relative inline-block w-4 mr-3 row-start-1 col-start-2 cursor-pointer"
                        onClick={() => setOpen(false)} 
                    >
                        <span className="absolute top-1/2 left-0 -translate-y-1/2 inline-block bg-white w-full h-1 rounded-full -rotate-45" />
                        <span className="absolute top-1/2 left-0 -translate-y-1/2 inline-block bg-white w-full h-1 rounded-full rotate-45" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 h-full overflow-x-auto">
                    {/* Alphabet container */}
                    <div className="bg-[var(--color-500)] p-3 rounded-lg mt-2 text-white shadow-md max-h-24 overflow-y-auto">
                        <h3 className="font-semibold mb-2 text-center">Alphabet</h3>
                        <p className="text-center">Σ = &#123; {alphabet.join(', ')} &#125;</p>
                    </div>
                    {/* container of some info */}
                    <div className="bg-[var(--color-500)] p-4 rounded-lg text-white">
                    
                        <h3 className="font-semibold mb-2 text-center">{option === 2 ? 'AFN' : 'AFD'}</h3>
                        <p>Initial state: {initialState}</p>
                        <p>Final state: {finalState}</p>
                        <p>Total of states: {totalStates}</p>
                    </div>
                    {/* container of states (property) */}
                    <div className="bg-[var(--color-500)] p-4 rounded-lg text-white">
                        <h3 className="font-semibold mb-2 text-center">States</h3>
                        // show the selected state
                    </div>
                    {/* container of states (property) */}
                    {str && (
                        <div className="bg-[var(--color-500)] p-4 rounded-lg mb-2 text-white ">
                            <h3 className="font-semibold mb-2 text-center">STR</h3>
                            <p className='overflow-x-auto'>{str}</p>
                        </div>
                    )}
                </div>
                
            </motion.div>
        </>
    );
}

export default Properties;
