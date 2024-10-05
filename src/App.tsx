import { useEffect, useRef, useState } from 'react';
import InputRegex from './components/InputRegex';
import { createGraph, getAPH, getTransitionTable } from './utils/regexUtils';
import './App.css';
import Options from './components/Options';
import Controls from './components/Controls';
import Properties from './components/Properties';
import Table from './components/Table';
import useGraphDrawer from './hooks/useGraphDrawer';
import RGraph from './objects/RGraph';

function App() {
    const [regex, setRegex] = useState('');
    const [str, setStr] = useState('');
    const [option, setOption] = useState(-1);
    const [intervalCode, setIntervalCode] = useState(0);
    const divRef = useRef<HTMLDivElement>(null);

    const [graph, setGraph] = useState<RGraph>();
    const [aph, setAph] = useState<string[]>();
    const [table, setTable] = useState<{
        [k: string]: {
            [k: string]: string[];
        };
    }>();

    const network = useGraphDrawer(divRef.current, graph);
    console.log(table);

    const EXECUTION_STEP = 700;

    const play = () => {
        if (!network) return;

        setIntervalCode(
            setInterval(() => {
                step();
            }, EXECUTION_STEP)
        );
    };

    const step = () => {
        if (!network) return;

        // network.updateClusteredNode(0, { color: 'blue' });
    };

    const stop = () => {
        if (!network) return;

        clearInterval(intervalCode);
    };

    useEffect(() => {
        const g = createGraph(regex);
        const a = getAPH(regex);

        setGraph(g);
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
                <Controls onPlay={play} onStep={step} onStop={stop} />
                <Properties />
                <Table />

                <div ref={divRef} className="w-full h-full"></div>
            </section>
        </div>
    );
}

export default App;
