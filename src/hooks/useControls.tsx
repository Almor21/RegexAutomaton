import React, { useCallback, useState } from 'react';
import { Network } from 'vis-network';

const EXECUTION_STEP = 700;

function useControls(network: Network | null, onStop: () => void) {
    const [intervalCode, setIntervalCode] = useState(-1);

    const play = useCallback(() => {
        setIntervalCode(
            setInterval(() => {
                step();
            }, EXECUTION_STEP)
        );
    }, [EXECUTION_STEP]);

    const step = useCallback(() => {
        if (!network) return;

        const n = network.getConnectedEdges(0);
        network.updateEdge(n[0], { color: 'red' });
    }, [network]);

    const stop = () => {
        if (!network) return;

        if (intervalCode !== -1) {
            clearInterval(intervalCode);
            setIntervalCode(-1);
        }

        onStop();
    };

    if (network) return { play, step, stop };
    return;
}

export default useControls;
