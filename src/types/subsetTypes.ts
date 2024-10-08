import RState from '../objects/RState';

export interface DState {
    states: RState[]; // El conjunto de estados del AFN que representa este estado del AFD
    marked: boolean; // Si el estado ya ha sido marcado
    label: string; // Letra que representa este estado en el AFD
}

export type EquivalenceTableType = {
    [key: string]: Set<string>;
};
