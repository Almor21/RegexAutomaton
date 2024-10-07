import { DState, estadosIguales, TransitionTable } from './subsetUtils';
import RState from '../objects/RState';




//Obtener los estados significativos de un subconjunto de estados
function getSignificant(
    states: RState[],
    transitionTable: any,
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
    tranD: TransitionTable,
    transitionTable: any,
    symbols: string[],
    finalState: RState
): [TransitionTable, any, string[]] {
    const estadosOptimizados: DState[] = [];
    let nuevoTranD: TransitionTable = {};
    let identicos: string[] = [];
    let estadosSignificativos: { [key: string]: Set<string> } = {};

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
            console.log(identical);

            for (const symbol of symbols) {
                if (tranD[estado.label] && tranD[estado.label][symbol]) {
                    nuevoTranD[estadoExistente.label] =
                        nuevoTranD[estadoExistente.label] || {};
                    nuevoTranD[estadoExistente.label][symbol] =
                        tranD[estado.label][symbol];
                }
            }

            // Ahora, actualizamos todas las referencias en la tabla de transiciones
            for (const [keyState, transitions] of Object.entries(tranD)) {
                for (const symbol of symbols) {
                    const targetState = transitions[symbol];
            
                    if (targetState === estado.label) {
                        // Si encontramos una transición que apunta al estado duplicado, actualizamos inmediatamente
                        transitions[symbol] = estadoExistente.label;
                    }
                }
            
                if (keyState === estado.label) {
                    nuevoTranD[estadoExistente.label] = transitions; 
                    delete nuevoTranD[estado.label]; // Eliminamos el estado duplicado
                }
            }

        } else {
            // Si no existe, añadimos el nuevo estado optimizado
            estadosOptimizados.push({
                states: significativos,
                marked: estado.marked,
                label: estado.label
            });

            nuevoTranD[estado.label] = tranD[estado.label];
        }
    }

    return [nuevoTranD, estadosSignificativos, identicos];
}
