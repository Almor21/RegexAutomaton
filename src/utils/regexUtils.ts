import { VALID_LETTERS } from '../config/constants';
import { tokenize, parse, buildAutomaton } from './AST-Utils';
import { SubSets } from './subsetUtils';

import RGraph from '../objects/RGraph';
import { AFDTableType } from '../types/afTypes';
import RState from '../objects/RState';
import RConnection from '../objects/RConnection';

export function validate(regex: string): boolean {
    // regex to detect valid characters
    const validPattern = /^[a-zA-Z0-9()+*?|&]*$/;

    // verify if expression have only characters allowed
    if (!validPattern.test(regex)) {
        return false;
    }

    // regex to detect invalid paterns like *?, +?, **, ++, etc.
    const invalidPattern = /[*+?]{2,}|[*+?][*+?]|[?*+](?=\))|[|]{2,}|^\||\|$/;

    // Verify if expression have invalid patterns
    if (invalidPattern.test(regex)) {
        return false;
    }

    try {
        new RegExp(regex);
        return true; // if can compile, the expression is valid
    } catch (e) {
        return false; // if can't compile, the expression is invalid
    }
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

export function getTransitionTable(graph: RGraph, columns: string[]) {
    return {
        initialState: graph.initState.getLabel(),
        finalState: graph.finalState.getLabel(),
        data: Object.fromEntries(
            graph.states.map((st) => [
                st.getLabel(),
                Object.fromEntries(
                    columns.map((cl) => [
                        cl,
                        st.connections
                            .filter((cn) => cn.value === cl)
                            .map((cn) => cn.next.getLabel())
                    ])
                )
            ])
        )
    };
}

export function createGraph(regex: string): RGraph | null {
    const tokens = tokenize(regex); // Tokenizamos la expresión
    const ast = parse(tokens); // Construimos el AST
    const graph = buildAutomaton(ast); // Construimos el autómata a partir del AST
    graph?.setLabels();
    return graph;
}

export function tableToGraph(afTable: AFDTableType): RGraph | null {
    // Get table
    const table = afTable.data;

    // create states
    const states = Object.fromEntries(
        Object.keys(table).map((name) => [name, new RState(name)])
    );

    // Create connections between states
    for (const name in table) {
        const tstate = table[name];
        const rstate = states[name];

        // Create connections to states
        for (const value in tstate) {
            const connections = tstate[value];
            connections.forEach((cn) =>
                rstate.addConnection(new RConnection(value, states[cn]))
            );
        }
    }

    // Create graph
    const graph = new RGraph(
        states[afTable.initialState],
        states[afTable.finalState],
        Object.values(states)
    );
    return graph;
}

//Create AFD not optimal
export function convertAFN_to_AFD_NoOp(AFN: RGraph, alphabet: string[]) {
    return SubSets(
        AFN.initState,
        AFN.states,
        getTransitionTable(AFN, ['', ...alphabet]),
        alphabet
    );
}
