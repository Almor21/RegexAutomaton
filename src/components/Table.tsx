import React, { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';
import RGraph from '../objects/RGraph';
import { TableType } from '../types/afTypes';

function Table({
    graph,
    alphabet,
    option,
    transitions
}: {
    graph: RGraph | null;
    alphabet: string[];
    option: number;
    transitions?: TableType;
}) {
    const [open, setOpen] = useState(false);
    const closeDiv = useRef<HTMLDivElement>(null);
    const openDiv = useRef<HTMLDivElement>(null);
    const [initialState, setInitialState] = useState<string | null>(null);
    const [finalStates, setFinalStates] = useState<string[]>([]);

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
                await animate(closeDiv.current, {
                    x: '0%'
                });
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
        }
    }, [graph]);

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
                className="absolute top-1/2 right-2 z-10 w-80 h-[95%] grid grid-rows-[auto_1fr] bg-[var(--color-300)] rounded-xl p-4 shadow-md"
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
                        onClick={() => setOpen(false)}
                    >
                        <span className="absolute top-1/2 left-0 -translate-y-1/2 inline-block bg-white w-full h-1 rounded-full -rotate-45" />
                        <span className="absolute top-1/2 left-0 -translate-y-1/2 inline-block bg-white w-full h-1 rounded-full rotate-45" />
                    </div>
                </div>

                <div className="flex flex-col gap-2 h-full overflow-x-auto">
                    {/* container that holds the transition table */}
                    <h2 className="text-white mt-2 text-center font-bold">
                        Transitions
                    </h2>
                    <div className="overflow-x-auto overflow-y-auto max-h-50 shadow-md rounded-lg bg-[var(--color-500)]">
                        {transitions && Object.keys(transitions).length > 0 ? (
                            <table className="min-w-full table-auto text-sm text-left text-white rounded-lg">
                                <thead className="sticky top-0 text-xs text-white font-bold bg-[var(--color-500)] border-b border-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            State
                                        </th>
                                        {alphabet.map((symbol, index) => (
                                            <th
                                                key={symbol || `empty_${index}`}
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                {symbol === '' ? '&' : symbol}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(transitions).map((state) => (
                                        <tr
                                            key={state}
                                            className="border-b bg-[var(--color-500)] border-white"
                                        >
                                            <td className="px-2 py-2 text-center">
                                                {state === initialState
                                                    ? `→ ${state}`
                                                    : finalStates.includes(
                                                          state
                                                      )
                                                    ? `* ${state}`
                                                    : state}
                                            </td>
                                            {alphabet.map((symbol, index) => (
                                                <td
                                                    key={
                                                        symbol ||
                                                        `empty_cell_${index}`
                                                    }
                                                    className="px-2 py-2 text-center whitespace-nowrap"
                                                >
                                                    {transitions[state][symbol]
                                                        ?.length > 1
                                                        ? `{${transitions[
                                                              state
                                                          ][symbol].join(
                                                              ', '
                                                          )}}` // if there are many states, show them in curly braces
                                                        : transitions[state][
                                                              symbol
                                                          ]?.length === 1
                                                        ? transitions[state][
                                                              symbol
                                                          ][0] // if there are only one state, show it
                                                        : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-10 text-white">
                                No data to display
                            </div>
                        )}
                    </div>

                    {/* container that will hold the states table */}
                    {/* the logic has not been implemented */}

                    {(option === 0 || option === 1) && (
                        <>
                            <h2 className="text-white mt-4 text-center font-bold">
                                States
                            </h2>
                            <div className="overflow-x-auto overflow-y-auto max-h-50 shadow-md rounded-lg bg-[var(--color-500)]">
                                <table className="min-w-full table-auto text-sm text-left text-white rounded-lg">
                                    <thead className="sticky top-0 text-xs text-white font-bold bg-[var(--color-500)] border-b border-white">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                AFD State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                AFN States
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* replace all with the States table */}
                                        <tr className="border-b bg-[var(--color-500)] border-white">
                                            <td className="px-6 py-3">1</td>
                                            <td className="px-6 py-3 text-center">
                                                0, 1
                                            </td>
                                        </tr>

                                        {/* replace all with the States table */}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
}

export default Table;
