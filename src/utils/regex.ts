import { createBase, createKleenLock, createOR } from "../objects/RCreator";
import RGraph from "../objects/RGraph";

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
export function getAPH(regex: string): string {
    return '';
}

// Create AFN Graph
export function createGraph(regex: string): RGraph | undefined {
    return;
}
