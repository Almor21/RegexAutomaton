import { useEffect, useRef, useState } from 'react';
import InputRegex from './components/InputRegex';
import Options from './components/Options';
import ControlsDisplay from './components/ControlsDisplay';
import Properties from './components/Properties';
import Table from './components/Table';

import useGraphDrawer from './hooks/useGraphDrawer';
import useControls from './hooks/useControls';
import './App.css';

import RGraph from './objects/RGraph';
import {
    createGraph,
    getAPH,
    getTransitionTable,
    convertAFN_to_AFD_NoOp,
    tableToGraph
} from './utils/regexUtils';
import { optimizarAFD } from './utils/significantStatesUtils';

import { AFDTableType, AFNTableType } from './types/afTypes';

function App() {
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const [option, setOption] = useState(0);

    const [alphabet, setAlphabet] = useState<string[]>([]);
    const [table, setTable] = useState<AFNTableType | AFDTableType>();
    const divRef = useRef<HTMLDivElement>(null);

    const [graph, setGraph] = useState<RGraph | null>(null);

    const [network, reset] = useGraphDrawer(divRef.current, graph);
    const controls = useControls(graph, network, str);

    useEffect(() => {
        if (!regex) return;

        const afnGraph = createGraph(regex);
        const aph = getAPH(regex);

        if (!afnGraph) return;

        afnGraph.setLabels();
        setAlphabet(aph);
        const afnTable = getTransitionTable(afnGraph, ['', ...aph]);
        if (option === 0) {
            setTable(afnTable);
            setGraph(afnGraph);
            return;
        }

        const [afdTable, afdStates] = convertAFN_to_AFD_NoOp(afnGraph, aph);
        if (option === 1) {
            setTable(afdTable);
            setGraph(tableToGraph(afdTable));
            return;
        }

        const [afdOptiTable, significantStates, identics] = optimizarAFD(
            afdStates,
            afdTable,
            afnTable.data,
            ['', ...aph],
            afnGraph.finalState
        );
        setTable(afdOptiTable);
        setGraph(tableToGraph(afdOptiTable));
    }, [regex, option]);

    return (
        <div className="grid grid-rows-[auto_1fr] min-h-screen">
            <section className="px-20 py-5 flex justify-center bg-[var(--color-300)]">
                <InputRegex onChangeRegex={setRegex} onChangeStr={setStr} />
            </section>
            <section className="relative p-2 bg-[var(--color-500)] overflow-x-hidden">
                <Options
                    active={Boolean(graph)}
                    value={option}
                    onChange={setOption}
                />

                <Properties
                    graph={graph}
                    alphabet={alphabet}
                    option={option}
                    str={str}
                />
                <Table
                    graph={graph}
                    alphabet={alphabet}
                    option={option}
                    transitions={table?.data}
                />

                <div ref={divRef} className="w-full h-full"></div>
                <ControlsDisplay controls={controls} />
            </section>
        </div>
    );
}

export default App;
