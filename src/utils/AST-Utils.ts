import {
    createBase,
    createKleenLock,
    createOR,
    createPositiveLock,
    createConcat,
    createOptional
} from '../objects/RCreator';

import RGraph from '../objects/RGraph';


interface Token {
    type:
        | 'literal'
        | 'or'
        | 'star'
        | 'plus'
        | 'question'
        | 'leftParen'
        | 'rightParen'
        | 'concat';
    value?: string;
}

interface ASTNode {
    type: 'literal' | 'concat' | 'or' | 'star' | 'plus' | 'question';
    left?: ASTNode;
    right?: ASTNode;
    value?: string;
}

export function tokenize(regex: string): Token[] {
    const tokens: Token[] = [];

    for (let i = 0; i < regex.length; i++) {
        const char = regex[i];
        switch (char) {
            case '|':
                tokens.push({ type: 'or' });
                break;
            case '*':
                tokens.push({ type: 'star' });
                break;
            case '+':
                tokens.push({ type: 'plus' });
                break;
            case '?':
                tokens.push({ type: 'question' });
                break;
            case '(':
                // Si el token anterior es un literal, paréntesis derecho, o un operador de repetición, agrega un token de concatenación
                if (
                    tokens.length > 0 &&
                    (tokens[tokens.length - 1].type === 'literal' ||
                        tokens[tokens.length - 1].type === 'rightParen' ||
                        tokens[tokens.length - 1].type === 'star' ||
                        tokens[tokens.length - 1].type === 'plus' ||
                        tokens[tokens.length - 1].type === 'question')
                ) {
                    tokens.push({ type: 'concat' });
                }
                tokens.push({ type: 'leftParen' });
                break;
            case ')':
                tokens.push({ type: 'rightParen' });
                break;
            default:
                // Para los literales, agregamos una concatenación implícita entre literales adyacentes
                if (
                    tokens.length > 0 &&
                    (tokens[tokens.length - 1].type === 'literal' ||
                        tokens[tokens.length - 1].type === 'rightParen' ||
                        tokens[tokens.length - 1].type === 'star' ||
                        tokens[tokens.length - 1].type === 'plus' ||
                        tokens[tokens.length - 1].type === 'question')
                ) {
                    tokens.push({ type: 'concat' });
                }
                tokens.push({ type: 'literal', value: char });
                break;
        }
    }
    return tokens;
}

export function parse(tokens: Token[]): ASTNode {
    const outputStack: ASTNode[] = [];
    const operatorStack: Token[] = [];

    while (tokens.length > 0) {
        const token = tokens.shift()!;

        switch (token.type) {
            case 'literal':
                outputStack.push({ type: 'literal', value: token.value });
                break;

            case 'concat':
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1].type === 'concat'
                ) {
                    const operator = operatorStack.pop()!;
                    const right = outputStack.pop()!;
                    const left = outputStack.pop()!;
                    outputStack.push({ type: 'concat', left, right });
                }
                operatorStack.push(token);
                break;

            case 'or':
                while (
                    operatorStack.length > 0 &&
                    (operatorStack[operatorStack.length - 1].type ===
                        'concat' ||
                        operatorStack[operatorStack.length - 1].type === 'or')
                ) {
                    const operator = operatorStack.pop()!;
                    const right = outputStack.pop()!;
                    const left = outputStack.pop()!;
                    outputStack.push({
                        type: operator.type as 'concat' | 'or',
                        left,
                        right
                    });
                }
                operatorStack.push(token);
                break;

            case 'star':
            case 'plus':
            case 'question': {
                const last = outputStack.pop()!;
                outputStack.push({ type: token.type, left: last });
                break;
            }

            case 'leftParen':
                operatorStack.push(token);
                break;

            case 'rightParen':
                while (
                    operatorStack.length > 0 &&
                    operatorStack[operatorStack.length - 1].type !== 'leftParen'
                ) {
                    const operator = operatorStack.pop()!;
                    const right = outputStack.pop()!;
                    const left = outputStack.pop()!;
                    outputStack.push({
                        type: operator.type as 'concat' | 'or',
                        left,
                        right
                    });
                }
                operatorStack.pop(); // Quitar el paréntesis izquierdo

                // Aplicar concatenación implícita después del paréntesis cerrado
                if (tokens.length > 0) {
                    const nextToken = tokens[0];
                    if (
                        nextToken.type === 'literal' ||
                        nextToken.type === 'leftParen'
                    ) {
                        tokens.unshift({ type: 'concat' });
                    }
                }
                break;
        }
    }

    // Procesar los operadores restantes en la pila
    while (operatorStack.length > 0) {
        const operator = operatorStack.pop()!;
        const right = outputStack.pop()!;
        const left = outputStack.pop()!;
        outputStack.push({
            type: operator.type as 'concat' | 'or',
            left,
            right
        });
    }

    return outputStack.pop()!;
}

export function buildAutomaton(node: ASTNode | undefined): RGraph | null {
    if (!node) {
        console.error('Received an undefined AST node');
        return null; // O lanzar un error, según lo que prefieras
    }

    switch (node.type) {
        case 'literal': {
            const baseGraph = createBase(node.value!);
            if (!baseGraph) {
                throw new Error(
                    `Failed to create base graph for literal ${node.value}`
                );
            }
            return baseGraph;
        }
        case 'concat': {
            const leftGraph = buildAutomaton(node.left!);
            const rightGraph = buildAutomaton(node.right!);
            if (!leftGraph || !rightGraph) {
                throw new Error(
                    'Concatenation failed due to missing operands.'
                );
            }
            return createConcat(leftGraph, rightGraph);
        }
        case 'or': {
            const leftGraph = buildAutomaton(node.left!);
            const rightGraph = buildAutomaton(node.right!);
            if (!leftGraph || !rightGraph) {
                throw new Error('OR operation failed due to missing operands.');
            }
            return createOR(leftGraph, rightGraph);
        }
        case 'star': {
            const subGraph = buildAutomaton(node.left!);
            if (!subGraph) {
                throw new Error(
                    'Kleene star operation failed due to missing operand.'
                );
            }
            return createKleenLock(subGraph);
        }
        case 'plus': {
            const subGraph = buildAutomaton(node.left!);
            if (!subGraph) {
                throw new Error(
                    'Positive closure operation failed due to missing operand.'
                );
            }
            return createPositiveLock(subGraph);
        }
        case 'question': {
            const subGraph = buildAutomaton(node.left!);
            if (!subGraph) {
                throw new Error(
                    'Optional operation failed due to missing operand.'
                );
            }
            return createOptional(subGraph);
        }
        default:
            throw new Error('Unknown AST node type');
    }
}
