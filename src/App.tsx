import { useState } from 'react';
import InputRegex from './components/InputRegex';
import GraphDrawer from './components/GraphDrawer';
import { createGraph, getAPH, getTransitionTable, convertAFN_to_AFD_NoOp } from './utils/regexUtils';
import './App.css';
import Options from './components/Options';
import Controls from './components/Controls';
import Properties from './components/Properties';
import Table from './components/Table';
import {cerraduraEpsilon, mueve} from './utils/subsetMethodsUtils';
import {optimizarAFD} from './utils/significantStatesUtils';
import { DState } from './utils/subsetUtils';

function App() {
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const [option, setOption] = useState(-1);
    const graph = createGraph(regex);
    const aph = getAPH(regex);
    let table;
    let epsilon;
    let afdOpti;
    let afdTable;

    if (graph) {
        graph.setLabels();
        table = getTransitionTable(graph, ['', ...aph]);
        afdTable = convertAFN_to_AFD_NoOp(graph, aph);
        afdOpti = optimizarAFD(afdTable[1] as DState[],afdTable[0], table,['', ...aph] , graph.finalState);
        console.log(afdOpti[0])
        console.log(afdOpti[1])
    }
    



    return (
        <div className="grid grid-rows-[auto_1fr] min-h-screen">
            <section className="px-20 py-5 flex justify-center bg-[var(--color-300)]">
                <InputRegex onChangeRegex={setRegex} onChangeStr={setStr} />
            </section>
            <section className="relative p-2 bg-[var(--color-500)] overflow-x-hidden">
                <Options value={option} onChange={setOption} />
                <Controls />
                <Properties />
                <Table />

                {graph && <GraphDrawer graph={graph} />}
            </section>
        </div>
    );
}

export default App;
