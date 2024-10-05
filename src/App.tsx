import { useState } from 'react';
import InputRegex from './components/InputRegex';
import GraphDrawer from './components/GraphDrawer';
import { createGraph, getAPH, getTransitionTable } from './utils/regexUtils';
import './App.css';
import Options from './components/Options';
import Controls from './components/Controls';
import Properties from './components/Properties';
import Table from './components/Table';

function App() {
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const [option, setOption] = useState(-1);
    const graph = createGraph(regex);
    const aph = getAPH(regex);
    let table;

    if (graph) {
        graph.setLabels();
        table = getTransitionTable(graph, ['', ...aph]);
    }
    console.log(table);

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
