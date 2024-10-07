import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IdType, Network } from 'vis-network';
import RGraph from '../objects/RGraph';
import RState from '../objects/RState';

const EXECUTION_STEP = 700;

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
    onStop: () => void
) {
    const [intervalCode, setIntervalCode] = useState(-1);
    const iletter = useRef(0);
    const stepsStack = useRef<Array<Step>>([]);

    const play = () => {
        if (intervalCode === -1) {
            setIntervalCode(
                setInterval(() => {
                    doStep();
                }, EXECUTION_STEP)
            );
        } else {
            clearInterval(intervalCode);
            setIntervalCode(-1);
        }
    };

    const doStep = () => {
        if (!graph || !network || !str) return;
        const lt = str.charAt(iletter.current);

        // Erase previous connections
        if (stepsStack.current.length > 1) {
            let previousStep =
                stepsStack.current[stepsStack.current.length - 2];

            network
                .getConnectedEdges(previousStep.node.ID)
                .filter((e) => {
                    if (previousStep.connEps && previousStep.connLet) {
                        return previousStep.connEps
                            .concat(previousStep.connLet)
                            .some(
                                (n) =>
                                    network
                                        .getConnectedNodes(e)[1]
                                        .toString() === n.ID
                            );
                    }
                })
                .forEach((e) => network.updateEdge(e, { color: 'white' }));

            network.updateClusteredNode(previousStep.node.ID, {
                borderWidth: 2,
                color: {
                    border: 'blue'
                }
            });
        }

        // Get Step
        let actualStep = stepsStack.current[stepsStack.current.length - 1];

        let actualNode = actualStep.node;
        let connEps: RState[] | null;
        let connLet: RState[] | null;

        const prevedge = network
            .getConnectedEdges(actualNode.ID)
            .find((e) => network.getConnectedNodes(e)[0] === actualStep.back);
        if (prevedge) network.updateEdge(prevedge, { color: 'blue' });

        network.updateClusteredNode(actualNode.ID, {
            borderWidth: 2,
            color: {
                border: 'yellow'
            }
        });

        if (!actualStep.connLet) {
            // Search routes
            actualStep.connEps = connEps = actualNode.connections
                .filter((cn) => !cn.value)
                .map((cn) => cn.next);
            actualStep.connLet = connLet = actualNode.connections
                .filter((cn) => cn.value === lt)
                .map((cn) => cn.next);
        } else {
            connEps = actualStep.connEps;
            connLet = actualStep.connLet;
        }

        network
            .getConnectedEdges(actualNode.ID)
            .filter((e) => {
                if (connEps && connLet) {
                    return connEps
                        .concat(connLet)
                        .some(
                            (n) =>
                                network.getConnectedNodes(e)[1].toString() ===
                                n.ID
                        );
                }
            })
            .forEach((e) => network.updateEdge(e, { color: 'yellow' }));

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

            network.updateClusteredNode(actualNode.ID, {
                borderWidth: 2,
                color: {
                    border: 'red'
                }
            });
            const edge = network
                .getConnectedEdges(actualNode.ID)
                .find(
                    (e) => network.getConnectedNodes(e)[0] === actualStep.back
                );
            if (edge) network.updateEdge(edge, { color: 'red' });
        }

        // // Do Step
        // if (stepsStack.current.length === 0) {
        //     // actualStep = {
        //     //     node: graph.initState,
        //     //     available: null,
        //     //     back: null
        //     // }
        // }

        // let nextNode;

        // if (stepsStack.current.length !== 0) {
        //     const actualRoutes =
        //         stepsStack.current[stepsStack.current.length - 1];

        //     const edges = network
        //         .getConnectedEdges(actualRoutes.node.ID)
        //         .filter((e) =>
        //             actualRoutes.available.some(
        //                 (n) => network.getConnectedNodes(e)[1] === n.ID
        //             )
        //         );
        //     edges.forEach((e) => network.updateEdge(e, { color: 'white' }));

        //     nextNode = actualRoutes.available.shift();
        // }

        // if (nextNode) {
        //     setIletter(iletter + 1);

        //     network.updateClusteredNode(nextNode.ID, {
        //         borderWidth: 2,
        //         color: {
        //             border: 'yellow'
        //         }
        //     });

        //     const connections = nextNode.connections.filter(
        //         (cn) => !cn.value || cn.value === lt
        //     );

        //     const edges = network
        //         .getConnectedEdges(nextNode.ID)
        //         .filter((r) =>
        //             connections.some(
        //                 (cn) => cn.next.ID === network.getConnectedNodes(r)[1]
        //             )
        //         );
        //     edges.forEach((e) => network.updateEdge(e, { color: 'yellow' }));

        //     stepsStack.current.push({
        //         node: nextNode,
        //         available: connections.map((cn) => cn.next),
        //         back: actualRoutes.node
        //     });
        // } else {
        //     setIletter(iletter - 1);
        //     nextNode = actualRoutes.back;

        //     network.updateClusteredNode(nextNode.ID, {
        //         color: {
        //             border: 'red'
        //         }
        //     });

        //     const edge = network
        //         .getConnectedEdges(actualRoutes.node.ID)
        //         .find(
        //             (r) =>
        //                 network.getConnectedNodes(r)[0] === actualRoutes.back.ID
        //         );
        //     if (edge) network.updateEdge(edge, { color: 'red' });

        //     stepsStack.current.pop();
        // }
    };

    const stop = () => {
        clearInterval(intervalCode);
        setIntervalCode(-1);
        iletter.current = 0;
        onStop();
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
        stop();
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
