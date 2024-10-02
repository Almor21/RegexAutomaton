import { VALID_LETTERS } from '../config/constants';
import { createBase, createKleenLock, createOR } from '../objects/RCreator';
import RGraph from '../objects/RGraph';

export function validate(regex: string): boolean {
    // Validate regex
    return true;
}

// Get regex's alphabet
export function getAPH(regex: string): string[] {
    return Array.from(
        new Set(
            regex.split('').filter((c) => VALID_LETTERS.some((lt) => lt === c))
        )
    ).sort();
}

// Create AFN Graph
export function createGraph(regex: string): RGraph | undefined {
    const a = createBase('a');

    if (a) return createKleenLock(a);
}

// Get AFN Transition Table
export function getTransitionTable(graph: RGraph, columns: string[]) {
    return Object.fromEntries(
        graph.states.map((st) => [
            st.getLabel(),
            Object.fromEntries(
                columns.map((cl) => [
                    cl,
                    st.connections
                        .find((cn) => cn.value === cl)
                        ?.next.getLabel()
                ])
            )
        ])
    );
}
