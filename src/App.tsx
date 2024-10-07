import { useEffect, useState } from 'react';
import InputRegex from './components/InputRegex';
import GraphDrawer from './components/GraphDrawer';
import Options from './components/Options';
import Controls from './components/Controls';
import Properties from './components/Properties';
import Table from './components/Table';
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

    const [alphabet, setAlphabet] = useState<string[]>();
    const [graph, setGraph] = useState<RGraph>();
    const [table, setTable] = useState<AFNTableType | AFDTableType>();

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
                <Controls />
                <Properties />
                <Table />

                {graph && <GraphDrawer graph={graph} />}
            </section>
        </div>
    );
}

export default App;
