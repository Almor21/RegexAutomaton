import { createBase, createKleenLock, createOR } from "../objects/RCreator";
import RGraph from "../objects/RGraph";

export function validate(regex: string): boolean {
    try {
        // block the use of the following characters: \ [ ] . ^ $
        const forbiddenPattern = /[\\\[\]\.\^\$]/;
        
        // verify if the regex contains forbidden characters
        if (forbiddenPattern.test(regex)) {
            return false;
        }

        // we tried to compile the regex
        new RegExp(regex);
        return true;  // if it compiles, it is valid
    } catch (e) {
        return false;  // if it doesn't compile, it is invalid
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
