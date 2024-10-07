import RState from '../objects/RState';
import { AFDTableType, TableType } from '../types/afTypes';
import { SignificantStatesType } from '../types/signStatesTypes';
import { DState } from '../types/subsetTypes';
import { estadosIguales } from './subsetUtils';

//Obtener los estados significativos de un subconjunto de estados
function getSignificant(
    states: RState[],
    transitionTable: TableType,
    symbols: string[],
    finalState: RState
): RState[] {
    const significativos = new Set<RState>();

    for (const state of states) {
        let significativo;
        let transiciones;
        for (const symbol of symbols) {
            transiciones = transitionTable[state.getLabel()][symbol];
            if (transiciones && transiciones.length > 0 && symbol === '') {
                significativo = false;
            } else if (
                transiciones &&
                transiciones.length > 0 &&
                symbol !== ''
            ) {
                significativo = true;
            }
        }

        if (significativo || state == finalState) {
            significativos.add(state);
        }
    }

    return Array.from(significativos);
}

// Función para optimizar el AFD basado en los estados significativos
export function optimizarAFD(
    estadosD: DState[],
    tranD: AFDTableType,
    transitionTable: TableType,
    symbols: string[],
    finalState: RState
): [AFDTableType, SignificantStatesType, string[]] {
    const estadosOptimizados: DState[] = [];
    const nuevoTranD: AFDTableType = {
        initialState: '',
        finalState: '',
        data: {}
    };
    const table = nuevoTranD.data;
    let identicos: string[] = [];
    let estadosSignificativos: SignificantStatesType = {};

    for (const estado of estadosD) {
        const significativos = getSignificant(
            estado.states,
            transitionTable,
            symbols,
            finalState
        );

        estadosSignificativos[estado.label] = new Set(
            significativos.map((st) => st.getLabel())
        );

        const estadoExistente = estadosOptimizados.find((opt) =>
            estadosIguales(opt.states, significativos)
        );

        if (estadoExistente) {
            // Si encontramos un estado equivalente, podemos fusionarlos
            const identical = `${estado.label} is identical to ${estadoExistente.label}`;
            identicos.push(identical);

            for (const symbol of symbols) {
                if (
                    tranD.data[estado.label] &&
                    tranD.data[estado.label][symbol]
                ) {
                    table[estadoExistente.label] =
                        table[estadoExistente.label] || {};
                    table[estadoExistente.label][symbol] =
                        tranD.data[estado.label][symbol];
                }
            }

            // Ahora, actualizamos todas las referencias en la tabla de transiciones
            for (const [keyState, transitions] of Object.entries(tranD.data)) {
                for (const symbol of symbols) {

                    const targetState = transitions[symbol];

                    if (targetState && targetState[0] === estado.label) {
                        // Si encontramos una transición que apunta al estado duplicado, actualizamos inmediatamente
                        transitions[symbol] = [estadoExistente.label];
                    }
                }

                if (keyState === estado.label) {
                    nuevoTranD.data[estadoExistente.label] = transitions;
                    delete nuevoTranD.data[estado.label]; // Eliminamos el estado duplicado
                }
            }
        } else {
            // Si no existe, añadimos el nuevo estado optimizado
            estadosOptimizados.push({
                states: significativos,
                marked: estado.marked,
                label: estado.label
            });

            table[estado.label] = tranD.data[estado.label];
        }
    }

    nuevoTranD.initialState = estadosOptimizados[0].label;
    nuevoTranD.finalState =
        estadosOptimizados[estadosOptimizados.length - 1].label;

    return [nuevoTranD, estadosSignificativos, identicos];
}
