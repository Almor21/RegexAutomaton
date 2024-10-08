import RState from '../objects/RState';
import { AFDTableType, AFNTableType } from '../types/afTypes';
import { DState, EquivalenceTableType } from '../types/subsetTypes';
import { cerraduraEpsilon, mueve } from './subsetMethodsUtils';

export function SubSets(
    initialState: RState,
    allStates: RState[],
    transitionTable: AFNTableType,
    symbols: string[] // Alfabeto del autómata (sin incluir epsilon)
): [AFDTableType, DState[], EquivalenceTableType] {
    let labelCounter = 0; // Contador para asignar letras a los estados
    const getNextLabel = () => String.fromCharCode(65 + labelCounter++); // A, B, C...

    const estadosD: DState[] = [
        {
            states: cerraduraEpsilon(
                [initialState],
                allStates,
                transitionTable
            ),
            marked: false,
            label: getNextLabel() // Asignar la primera letra
        }
    ];

    const tranD: AFDTableType = {
        initialState: '',
        finalState: '',
        data: {}
    }; // Tabla de transiciones del AFD, usando letras como estados
    
    const table = tranD.data;
    const stateMapping: { [key: string]: Set<string> } = {};

    while (estadosD.some((d) => !d.marked)) {
        const T = estadosD.find((d) => !d.marked)!;
        T.marked = true; // Marcar el estado T

        table[T.label] = {}; // Inicializar transiciones para este estado en la tabla AFD
        // Guardar el estado 'T' en el formato solicitado (e.g. "A" : {0, 1, 2, 3})
        stateMapping[T.label] = new Set(T.states.map((state) => state.getLabel()));

        for (const symbol of symbols) {
            const U = cerraduraEpsilon(
                mueve(T.states, symbol, allStates, transitionTable),
                allStates,
                transitionTable
            );

            if (U.length === 0) {
                continue;
            }

            // Verificar si el conjunto de estados U ya está en estadosD
            let existingState = estadosD.find((d) =>
                estadosIguales(d.states, U)
            );

            if (!existingState) {
                // Si no está, añadirlo con una nueva letra
                const newLabel = getNextLabel();
                estadosD.push({ states: U, marked: false, label: newLabel });
                existingState = { states: U, marked: false, label: newLabel };
            }

            table[T.label][symbol] = [existingState.label];
        }
    }

    tranD.initialState = estadosD[0].label;
    tranD.finalState = estadosD[estadosD.length - 1].label;
    return [tranD, estadosD, stateMapping];
}

// Función auxiliar para comparar si dos conjuntos de estados son iguales
export function estadosIguales(states1: RState[], states2: RState[]): boolean {
    if (states1.length !== states2.length) return false;
    const labels1 = states1.map((st) => st.getLabel()).sort();
    const labels2 = states2.map((st) => st.getLabel()).sort();
    return labels1.every((label, index) => label === labels2[index]);
}
