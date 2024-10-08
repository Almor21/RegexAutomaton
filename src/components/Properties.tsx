import React, { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';
import RGraph from '../objects/RGraph';
import RState from '../objects/RState';

function Properties({
    graph,
    alphabet,
    option,
    str,
    selectState
}: {
    graph: RGraph | null;
    alphabet?: string[];
    option: number;
    str: string;
    selectState: RState | null;
}) {
    const [open, setOpen] = useState(false);
    const closeDiv = useRef<HTMLDivElement>(null);
    const openDiv = useRef<HTMLDivElement>(null);
    const [initialState, setInitialState] = useState<string | null>(null);
    const [finalStates, setFinalStates] = useState<string[]>([]);
    const [totalStates, setTotalStates] = useState<number>(0);

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

    useEffect(() => {
        if (graph) {
            setInitialState(
                graph.initState ? graph.initState.getLabel() : null
            );
            setFinalStates(
                graph.finalState ? [graph.finalState.getLabel()] : []
            );
            setTotalStates(graph.states.length);
        }
    }, [graph]);

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
                className="absolute top-1/2 left-2 z-10 w-64 h-[95%] grid grid-rows-[auto_1fr] bg-[var(--color-300)] rounded-xl p-4 shadow-[1px_3px_6px_rgba(0,0,0,0.4)]"
                style={{
                    x: '-110%',
                    y: '-50%'
                }}
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
                <div className="h-full p-2 flex flex-col gap-2 overflow-x-auto">
                    {/* container of states (property) */}
                    <div className="bg-[var(--color-500)] p-3 rounded-lg text-white ">
                        <h3 className="font-semibold mb-2 text-center">
                            Test String
                        </h3>
                        <p className="overflow-x-auto h-6">{str}</p>
                    </div>
                    {/* Alphabet container */}
                    <div className="h-32 bg-[var(--color-500)] p-3 rounded-lg text-white shadow-md">
                        <h3 className="font-semibold mb-2 text-center">
                            Alphabet
                        </h3>
                        <p className="text-center">
                            Σ = &#123;{' '}
                            {alphabet &&
                                alphabet
                                    .filter((s) => s)
                                    .join(', ')}{' '}
                            &#125;
                        </p>
                    </div>
                    {/* container of some info */}
                    <div className="bg-[var(--color-500)] p-3 rounded-lg text-white">
                        <h3 className="font-semibold mb-2 text-center">
                            {option === 0 ? 'AFN' : 'AFD'}
                        </h3>
                        <p>Initial state: {initialState}</p>
                        <p>Final state: {finalStates.join(', ')}</p>
                        <p>Total of states: {totalStates ? totalStates : ''}</p>
                    </div>
                    {/* container of states (property) */}
                    <div className="bg-[var(--color-500)] p-3 rounded-lg text-white">
                        <h3 className="font-semibold mb-2 text-center">
                            States
                        </h3>
                        <p>
                            Label: {selectState ? selectState.getLabel() : ''}
                        </p>
                        <p>Connections:</p>
                        {selectState ? (
                            selectState.connections.map((cn) => (
                                <p>
                                    {cn.value || '&'} -&gt; {cn.next.getLabel()}
                                </p>
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default Properties;
