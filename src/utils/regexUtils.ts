import { VALID_LETTERS } from '../config/constants';
import { tokenize, parse, buildAutomaton } from './AST-Utils';
import { SubSets } from './subsetUtils';

import RGraph from '../objects/RGraph';

export function validate(regex: string): boolean {
    // regex to detect valid characters
    const validPattern = /^[a-zA-Z0-9()+*?|]*$/;

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
        return true;  // if can compile, the expression is valid
    } catch (e) {
        return false;  // if can't compile, the expression is invalid
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
    return Object.fromEntries(
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
    );
}


export function createGraph(regex: string): RGraph | undefined {
    const tokens = tokenize(regex); // Tokenizamos la expresión
    const ast = parse(tokens); // Construimos el AST
    return buildAutomaton(ast); // Construimos el autómata a partir del AST
}


//Create No AFN not optimal
export function convertAFN_to_AFD_NoOp(AFN: RGraph, alphabet: string[] ) {  
    return  SubSets(AFN.initState, AFN.states, getTransitionTable(AFN , ['', ...alphabet]), alphabet);
}