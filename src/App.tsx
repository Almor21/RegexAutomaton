import { useState } from 'react';
import InputRegex from './components/InputRegex';
import Title from './components/Title';
import GraphDrawer from './components/GraphDrawer';
import { createGraph, getAPH, getTransitionTable } from './utils/regex';
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
    let TransitionTable = {};
    let initialState = null;
    let finalStates: string[] = [];

    if (graph) {
        graph.setLabels();
        console.log(getTransitionTable(graph, ['', ...aph]));
        console.log(str);
        TransitionTable = getTransitionTable(graph, ['', ...aph]);

        // Obtaining the initial and final states
        initialState = graph.initState ? graph.initState.getLabel() : null;
        finalStates = graph.finalState ? [graph.finalState.getLabel()] : [];
    }

    return (
        <div className="grid grid-rows-[auto_1fr] min-h-screen">
            <section className="px-20 py-5 flex justify-center bg-[var(--color-300)]">
                <InputRegex onChangeRegex={setRegex} onChangeStr={setStr} />
            </section>
            <section className="relative p-2 bg-[var(--color-500)] overflow-x-hidden">
                <Options value={option} onChange={setOption} />
                <Controls />
                <Properties 
                    alphabet={aph}
                    initialState={initialState}
                    finalState={finalStates}
                    transitions={TransitionTable}
                    totalStates={graph ? graph.states.length : 0}
                    option={option}
                    str={str}
                />
                <Table
                        table={TransitionTable}
                        alphabet={['', ...aph]}
                        initialState={initialState}
                        finalState={finalStates}
                        option={option}
                    />

                {graph && <GraphDrawer graph={graph} />}
            </section>
        </div>
    );
}

export default App;
