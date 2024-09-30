import RState from './RState';
import RConnection from './RConnection';
import RGraph from './RGraph';

// Create case base AFN
export function createBase(value: string): RGraph | undefined {
    if (value.length > 1) {
        console.error(`Value ${value} not valid to base AFN`);
        return;
    }

    const initState = new RState();
    const finalState = new RState();
    const connection = new RConnection(value, finalState);

    initState.addConnection(connection);
    return new RGraph(initState, finalState);
}

// Create (rg1)|(rg2) AFN
export function createOR(rg1: RGraph, rg2: RGraph): RGraph {
    const initState = new RState();
    initState.addConnection(new RConnection('', rg1.initState));
    initState.addConnection(new RConnection('', rg2.initState));

    const finalState = new RState();
    rg1.finalState.addConnection(new RConnection('', finalState));
    rg2.finalState.addConnection(new RConnection('', finalState));

    const nwStates = rg1.states.concat(rg2.states);
    nwStates.push(initState, finalState);
    return new RGraph(initState, finalState, nwStates);
}

// Create (rg1).(rg2) AFN
export function createConcat(rg1: RGraph, rg2: RGraph): RGraph {
    const initState = rg1.initState;
    const midState = rg1.finalState;
    const finalState = rg2.finalState;

    rg2.initState.connections.forEach((cn) => midState.addConnection(cn));

    let nwStates = rg1.states.concat(rg2.states);
    nwStates = nwStates.filter((st) => st !== rg2.initState);
    return new RGraph(initState, finalState, nwStates);
}

// Create rg* AFN
export function createKleenLock(rg: RGraph): RGraph {
    const initState = new RState();
    const midState = rg.finalState;
    const finalState = new RState();

    initState.addConnection(new RConnection('', rg.initState));
    initState.addConnection(new RConnection('', finalState));

    midState.addConnection(new RConnection('', rg.initState));
    midState.addConnection(new RConnection('', finalState));

    const nwStates = [...rg.states];
    nwStates.push(initState, finalState);
    return new RGraph(initState, finalState, nwStates);
}

// Create rg+ AFN
export function createPositiveLock(rg: RGraph): RGraph {
    const initState = new RState();
    const midState = rg.finalState;
    const finalState = new RState();

    initState.addConnection(new RConnection('', rg.initState));

    midState.addConnection(new RConnection('', rg.initState));
    midState.addConnection(new RConnection('', finalState));

    const nwStates = [...rg.states];
    nwStates.push(initState, finalState);
    return new RGraph(initState, finalState, nwStates);
}

// Create rg? AFN
export function createOptional(rg: RGraph): RGraph {
    const initState = new RState();
    const midState = rg.finalState;
    const finalState = new RState();

    initState.addConnection(new RConnection('', rg.initState));
    initState.addConnection(new RConnection('', finalState));

    midState.addConnection(new RConnection('', finalState));

    const nwStates = [...rg.states];
    nwStates.push(initState, finalState);
    return new RGraph(initState, finalState, nwStates);
}
