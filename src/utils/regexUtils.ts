import { VALID_LETTERS } from '../config/constants';
import { tokenize, parse, buildAutomaton } from './AST-Utils';
import { SubSets } from './subsetUtils';

import RGraph from '../objects/RGraph';
import { AFDTableType } from '../types/afTypes';
import RState from '../objects/RState';
import RConnection from '../objects/RConnection';

export function validate(regex: string): boolean {
    // Check if regex contains only allowed characters: letters, (, ), *, ?, +, |, &
    if (!/^[a-zA-Z()*?+|&]+$/.test(regex)) {
        return false;
    }

    // Ensure regex starts with a valid character
    if (/^[+?|)]./.test(regex)) {
        return false;
    }

    // Detect repeated special characters like ?, +, *
    if (/([*+?])\1+/.test(regex)) {
        return false;
    }

    // Validate pipes have valid characters around them, including epsilon (&)
    if (/\|{2,}|\(\||\|\)|\|$|^\|/.test(regex)) {
        return false;
    }

    // Check for empty or invalid parentheses
    if (/\(\)|\([^a-zA-Z&|]*\)/.test(regex)) {
        return false;
    }

    // Check if parentheses are balanced
    let openCount = 0;
    for (const char of regex) {
        if (char === '(') {
            openCount++;
        } else if (char === ')') {
            openCount--;
            if (openCount < 0) {
                return false;
            }
        }
    }
    if (openCount !== 0) {
        return false;
    }

    // Attempt to compile the regex
    try {
        new RegExp(regex);
        return true;
    } catch {
        return false;
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
