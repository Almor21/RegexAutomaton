import RState from '../objects/RState';
import { cerraduraEpsilon, mueve } from './subsetMethodsUtils';

interface DState {
    states: RState[]; // El conjunto de estados del AFN que representa este estado del AFD
    marked: boolean;  // Si el estado ya ha sido marcado
    label: string;    // Letra que representa este estado en el AFD
}

export function SubSets(
    initialState: RState,
    allStates: RState[],
    transitionTable: any,
    symbols: string[] // Alfabeto del autómata (sin incluir epsilon)
) {
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

    const tranD: { [key: string]: { [symbol: string]: string } } = {}; // Tabla de transiciones del AFD, usando letras como estados

    while (estadosD.some((d) => !d.marked)) {
        const T = estadosD.find((d) => !d.marked)!;
        T.marked = true; // Marcar el estado T

        tranD[T.label] = {}; // Inicializar transiciones para este estado en la tabla AFD

        for (const symbol of symbols) {

            const U = cerraduraEpsilon(
                mueve(T.states, symbol, allStates, transitionTable),
                allStates,
                transitionTable
            );

            // Verificar si el conjunto de estados U ya está en estadosD
            let existingState = estadosD.find((d) => estadosIguales(d.states, U));

            if (!existingState) {
                // Si no está, añadirlo con una nueva letra
                const newLabel = getNextLabel();
                estadosD.push({ states: U, marked: false, label: newLabel });
                existingState = { states: U, marked: false, label: newLabel };
            }

            tranD[T.label][symbol] = existingState.label;
        }
    }

    return tranD; 
}

// Función auxiliar para comparar si dos conjuntos de estados son iguales
function estadosIguales(states1: RState[], states2: RState[]): boolean {
    if (states1.length !== states2.length) return false;
    const labels1 = states1.map((st) => st.getLabel()).sort();
    const labels2 = states2.map((st) => st.getLabel()).sort();
    return labels1.every((label, index) => label === labels2[index]);
}
