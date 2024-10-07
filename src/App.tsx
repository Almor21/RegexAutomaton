import { useCallback, useEffect, useRef, useState } from 'react';
import InputRegex from './components/InputRegex';
import { createGraph, getAPH, getTransitionTable } from './utils/regexUtils';
import './App.css';
import Options from './components/Options';
import ControlsDisplay from './components/ControlsDisplay';
import Properties from './components/Properties';
import Table from './components/Table';
import useGraphDrawer from './hooks/useGraphDrawer';
import RGraph from './objects/RGraph';
import useControls from './hooks/useControls';

function App() {
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const [option, setOption] = useState(-1);
    const divRef = useRef<HTMLDivElement>(null);

    const [graph, setGraph] = useState<RGraph | null>(null);
    const [aph, setAph] = useState<string[]>();
    const [table, setTable] = useState<{
        [k: string]: {
            [k: string]: string[];
        };
    }>();
    
    const [network, reset] = useGraphDrawer(divRef.current, graph);
    const controls = useControls(graph, network, str, reset);

    useEffect(() => {
        const g = createGraph(regex);
        const a = getAPH(regex);

        if (g) setGraph(g);
        setAph(a);
        if (g && a) setTable(getTransitionTable(g, ['', ...a]));
    }, [regex]);

    return (
        <div className="grid grid-rows-[auto_1fr] min-h-screen">
            <section className="px-20 py-5 flex justify-center bg-[var(--color-300)]">
                <InputRegex onChangeRegex={setRegex} onChangeStr={setStr} />
            </section>
            <section className="relative p-2 bg-[var(--color-500)] overflow-x-hidden">
                <Options value={option} onChange={setOption} />
                <Properties />
                <Table />
                <div ref={divRef} className="w-full h-full"></div>
                <ControlsDisplay controls={controls} />
            </section>
        </div>
    );
}

export default App;
