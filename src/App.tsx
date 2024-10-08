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
import RState from './objects/RState';

import {
    createGraph,
    getAPH,
    getTransitionTable,
    convertAFN_to_AFD_NoOp,
    tableToGraph
} from './utils/regexUtils';
import { optimizarAFD } from './utils/significantStatesUtils';

import { AFDTableType, AFNTableType } from './types/afTypes';
import { EquivalenceTableType } from './types/subsetTypes';

function App() {
    const divRef = useRef<HTMLDivElement>(null);
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const [option, setOption] = useState(0);
    const [selectState, setSelectState] = useState<RState | null>(null);
    const [clickPosition, setClickPosition] = useState({
        x: 0,
        y: 0
    });
    const [executionTime, setExecutionTime] = useState(100);

    const [graph, setGraph] = useState<RGraph | null>(null);
    const [alphabet, setAlphabet] = useState<string[]>([]);
    const [table, setTable] = useState<AFNTableType | AFDTableType>();

    const [equivalence, setEquivalence] = useState<EquivalenceTableType | null>(
        null
    );
    const [identics, setIdentics] = useState<string[]>([]);

    
    const [network, reset] = useGraphDrawer(divRef.current, graph);
    const controls = useControls(graph, network, str, executionTime);
    
    const changeExecutionTime = (n: number) => {
        setExecutionTime(n >= 100 ? n : 100);
    };

    useEffect(() => {
        if (!regex) return;

        const afnGraph = createGraph(regex);
        const aph = getAPH(regex);
        if (!afnGraph) return;

        setAlphabet(!aph.includes('&') ? ['', ...aph] : aph);
        afnGraph.setLabels();
        const afnTable = getTransitionTable(afnGraph, ['',...aph]);
        if (option === 0) {
            setTable(afnTable);
            setGraph(afnGraph);
            return;
        }

        setAlphabet(aph);
        const [afdTable, afdStates, equivalence] = convertAFN_to_AFD_NoOp(
            afnGraph,
            aph
        );
        if (option === 1) {
            setTable(afdTable);
            setGraph(tableToGraph(afdTable));
            setEquivalence(equivalence);
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
        setEquivalence(significantStates);
        setIdentics(identics);
    }, [regex, option, str]);

    useEffect(() => {
        if (!(network && graph)) return;
        const id = network.getNodeAt(clickPosition);

        setSelectState(graph.getState(id as string) || null);
    }, [clickPosition]);

    useEffect(() => {
        if (!divRef.current) return;

        divRef.current.addEventListener('mousedown', (e) => {
            const x = e.offsetX;
            const y = e.offsetY;

            setClickPosition({ x, y });
        });
    }, []);

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
                    selectState={selectState}
                />
                <Table
                    graph={graph}
                    alphabet={[...alphabet]}
                    option={option}
                    transitions={table?.data}
                    equivalence={option === 1 ? equivalence : null}
                    significantStates={option === 2 ? equivalence : null}
                    identics={identics}
                />

                <div ref={divRef} className="h-full"></div>
                <ControlsDisplay controls={controls} onChangeTime={changeExecutionTime} />
            </section>
        </div>
    );
}

export default App;
