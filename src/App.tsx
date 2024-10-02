import { useState } from 'react';
import InputRegex from './components/InputRegex';
import Title from './components/Title';
import GraphDrawer from './components/GraphDrawer';
import { createGraph, getAPH, getTransitionTable } from './utils/regex';
import './App.css';

function App() {
    const [regex, setRegex] = useState('');
    const graph = createGraph(regex);
    const aph = getAPH(regex);

    if (graph) {
        graph.setLabels();
        console.log(getTransitionTable(graph, ['', ...aph]));
    }

    return (
        <>
            <Title />
            <InputRegex set={setRegex} />
            {graph && <GraphDrawer graph={graph} />}
        </>
    );
}

export default App;
