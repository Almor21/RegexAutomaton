import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IdType, Network } from 'vis-network';
import RGraph from '../objects/RGraph';
import RState from '../objects/RState';

const EXECUTION_STEP = 100;

type Step = {
    node: RState;
    connEps: RState[] | null;
    connLet: RState[] | null;
    letStep: string;
    back: IdType;
};

function useControls(
    graph: RGraph | null,
    network: Network | null,
    str: string,
    onStop?: () => void
) {
    const intervalCode = useRef(-1);
    const iletter = useRef(0);
    const indexStep = useRef(0);
    const stepsStack = useRef<Array<Step>>([]);
    const finish = useRef(false);

    const paintNode = (idNode: IdType, color: string) => {
        if (!network) return;

        network.updateClusteredNode(idNode, {
            borderWidth: 2,
            color: {
                border: color
            }
        });
    };

    const paintEdges = (idFrom: IdType, idTo: IdType[], color: string) => {
        if (!network) return;

        network
            .getConnectedEdges(idFrom)
            .filter((e) =>
                idTo.some(
                    (n) =>
                        idFrom === network.getConnectedNodes(e)[0] &&
                        n === network.getConnectedNodes(e)[1]
                )
            )
            .forEach((e) => network.updateEdge(e, { color }));
    };

    const clean = () => {
        if (!graph) return;
        paintNode('0', 'white');
        paintEdges('0', [graph.initState.ID], 'white');

        graph.states.forEach((node) => {
            paintNode(node.ID, 'white');
            paintEdges(
                node.ID,
                node.connections.map((cn) => cn.next.ID),
                'white'
            );
        });
    };

    const play = () => {
        if (intervalCode.current === -1) {
            intervalCode.current = setInterval(() => {
                doStep();
            }, EXECUTION_STEP);
        } else {
            clearInterval(intervalCode.current);
            intervalCode.current = -1;
        }
    };

    const doStep = () => {
        if (!graph || !network || !str) return;

        const lt = str.charAt(iletter.current);
        let actualStep: Step;
        let previousNode: IdType;
        let actualNode: RState;

        if (finish.current) {
            if (indexStep.current === 0) clean();

            if (indexStep.current > 0) {
                actualStep = stepsStack.current[indexStep.current - 1];
                previousNode = actualStep.back;
                actualNode = actualStep.node;

                paintNode(actualNode.ID, 'green');
                paintEdges(previousNode, [actualNode.ID], 'green');
            }

            if (indexStep.current === stepsStack.current.length) {
                clearInterval(intervalCode.current);
                intervalCode.current = -1;
                indexStep.current = 0;
                return;
            }

            actualStep = stepsStack.current[indexStep.current];
            previousNode = actualStep.back;
            actualNode = actualStep.node;

            paintNode(actualNode.ID, 'yellow');
            paintEdges(previousNode, [actualNode.ID], 'yellow');
            indexStep.current++;
            return;
        }

        // Erase previous connections
        if (stepsStack.current.length > 1) {
            let previousStep =
                stepsStack.current[stepsStack.current.length - 2];

            if (!(previousStep.connEps && previousStep.connLet)) return;
            const connections = previousStep.connEps.concat(
                previousStep.connLet
            );

            paintEdges(
                previousStep.node.ID,
                connections.map((cn) => cn.ID),
                'white'
            );
            paintNode(previousStep.node.ID, 'blue');
        }

        // Get Step
        actualStep = stepsStack.current[stepsStack.current.length - 1];

        // Not match case
        if (!actualStep) {
            clearInterval(intervalCode.current);
            intervalCode.current = -1;
            console.log('Not match');
            return;
        }

        actualNode = actualStep.node;
        let connEps: RState[] | null;
        let connLet: RState[] | null;

        paintEdges(actualStep.back, [actualNode.ID], 'blue');
        paintNode(actualNode.ID, 'yellow');

        // Match case
        if (iletter.current === str.length && actualNode === graph.finalState) {
            paintNode(actualNode.ID, 'green');
            finish.current = true;
            indexStep.current = 0;
            return;
        }

        if (!actualStep.connLet) {
            // Search routes
            actualStep.connEps = connEps = actualNode.connections
                .filter((cn) => !cn.value)
                .map((cn) => cn.next);
            actualStep.connLet = connLet = actualNode.connections
                .filter((cn) => lt && cn.value === lt)
                .map((cn) => cn.next);
        } else {
            connEps = actualStep.connEps;
            connLet = actualStep.connLet;
        }

        if (connEps && connLet) {
            const connections = connEps.concat(connLet);

            paintEdges(
                actualNode.ID,
                connections.map((cn) => cn.ID),
                'yellow'
            );
        }

        let nextNode;
        let nextLet;
        // Get next Node
        if (connLet && connLet.length !== 0) {
            iletter.current++;
            nextNode = connLet.pop();
            nextLet = lt;
        } else if (connEps && connEps.length !== 0) {
            nextNode = connEps.pop();
            nextLet = '';
        }

        // Create next step
        if (nextNode) {
            stepsStack.current.push({
                node: nextNode,
                connEps: null,
                connLet: null,
                letStep: nextLet || '',
                back: actualNode.ID
            });
        } else {
            if (actualStep.letStep) iletter.current--;
            stepsStack.current.pop();

            paintNode(actualNode.ID, 'red');
            paintEdges(actualStep.back, [actualNode.ID], 'red');
        }
    };

    const stop = () => {
        clean();

        clearInterval(intervalCode.current);
        intervalCode.current = -1;
        iletter.current = 0;
        finish.current = false;
        indexStep.current = 0;
        if (graph)
            stepsStack.current = [
                {
                    node: graph.initState,
                    connEps: null,
                    connLet: null,
                    letStep: '',
                    back: '0'
                }
            ];
    };

    useEffect(() => {
        clearInterval(intervalCode.current);
        intervalCode.current = -1;
        iletter.current = 0;
        finish.current = false;
        indexStep.current = 0;

        if (graph?.initState) {
            stepsStack.current = [
                {
                    node: graph.initState,
                    connEps: null,
                    connLet: null,
                    letStep: '',
                    back: '0'
                }
            ];
        }
    }, [graph, str]);

    if (network) return { play, step: doStep, stop };
    return;
}

export default useControls;
