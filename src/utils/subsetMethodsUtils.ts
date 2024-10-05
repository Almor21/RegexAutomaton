import RGraph from '../objects/RGraph';
import RState from '../objects/RState';

function searchTransitions(
    state: RState[],
    allStates: RState[],
    transitionTable: any,
    symbol?: string
): Set<RState> {
    let sym = symbol ? symbol : '';
    const setOperation = symbol ? new Set<RState>() : new Set<RState>(state); // Inicializa con los estados de entrada
    const stack = [...state]; 

    // Procesamos cada estado en la pila
    while (stack.length > 0) {
        const currentState = stack.pop()!;
        const currentStateLabel = currentState.getLabel();

        // Buscamos todas las transiciones con el simbolo 
        const symbolTransitions = transitionTable[currentStateLabel][sym];

        if (symbolTransitions) {
            for (const nextStateLabel of symbolTransitions) {
                const nextState = getStateByLabel(allStates, nextStateLabel); 
                if (!setOperation.has(nextState)) {
                    setOperation.add(nextState); 
                    stack.push(nextState); 
                }
            }
        }
    }

    return setOperation;
}

// Función para obtener la cerradura-epsilon de un conjunto de estados
export function cerraduraEpsilon(
    state: RState[],
    allStates: RState[],
    transitionTable: any
): RState[] {
    const epsilonClousure = searchTransitions(
        state,
        allStates,
        transitionTable
    );
    const labels_in = state.map((state) => state.getLabel());
    const labels_out = Array.from(epsilonClousure).map((state) =>
        state.getLabel()
    );
    const setEpsilon = `Cerradura-Epsilon ({${labels_in.join(
        ', '
    )}}): { ${labels_out.join(', ')} }`;
    console.log(setEpsilon);

    return Array.from(epsilonClousure);
}

export function mueve(
    state: RState[],
    symbol: string,
    allStates: RState[],
    transitionTable: any
): RState[] {
    const mueveSymbol = searchTransitions(
        state,
        allStates,
        transitionTable,
        symbol
    );
    const labels_in = state.map((state) => state.getLabel());
    const labels_out = Array.from(mueveSymbol).map((state) => state.getLabel());
    const setMueveSymbol = `mueve({${labels_in.join(
        ', '
    )}}, ${symbol}): { ${labels_out.join(', ')} }`;
    console.log(setMueveSymbol);

    return Array.from(mueveSymbol);
}

function getStateByLabel(states: RState[], label: string): RState {
    // Buscar el estado por su etiqueta (label)
    const state = states.find((state) => state.getLabel() === label);
    if (!state) {
        throw new Error(`State with label ${label} not found.`);
    }
    return state;
}

export function convertAFN_to_AFD_NoOp(regex: string): RGraph | undefined {
    return undefined;
}
