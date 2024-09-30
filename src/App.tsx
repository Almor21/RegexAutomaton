import { useState } from 'react';
import InputRegex from './components/InputRegex';
import Title from './components/Title';
import GraphDrawer from './components/GraphDrawer';
import { createGraph } from './utils/regex';
import './App.css';

function App() {
    const [regex, setRegex] = useState('');
    const graph = createGraph(regex);

    return (
        <>
            <Title />
            <InputRegex set={setRegex} />
            {graph && <GraphDrawer graph={graph} />}
        </>
    );
}

export default App;
