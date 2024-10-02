import React, { useEffect, useRef, useState } from 'react';
import RGraph from '../objects/RGraph';
import { DataSet, Edge, Network, Node } from 'vis-network/standalone';

function GraphDrawer({ graph }: { graph: RGraph }) {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let network: Network;

        const nodes_array: Node[] = [
            {
                id: '0',
                color: {
                    border: 'black'
                }
            },
            {
                id: graph.initState.ID,
                label: graph.initState.getLabel()
            }
        ];

        const edges_array: Edge[] = [
            {
                from: '0',
                to: graph.initState.ID,
                arrows: 'to',
                label: 'start',
                font: { align: 'horizontal' },
                color: 'white'
            }
        ];

        for (const st of graph.states) {
            if (st !== graph.initState && st !== graph.finalState) {
                nodes_array.push({
                    id: st.ID,
                    label: st.getLabel()
                });
            }

            edges_array.push(
                ...st.connections.map((cn) => ({
                    from: st.ID,
                    to: cn.next.ID,
                    arrows: 'to',
                    label: cn.value || 'ϵ',
                    font: { align: 'horizontal' }
                }))
            );
        }

        nodes_array.push({
            id: graph.finalState.ID,
            label: graph.finalState.getLabel()
        });

        const nodes = new DataSet<Node>(nodes_array);
        const edges = new DataSet<Edge>(edges_array);

        const data = {
            nodes: nodes,
            edges: edges
        };

        if (divRef.current) {
            network = new Network(divRef.current, data, {
                physics: false,
                nodes: {
                    size: 100,
                    chosen: false,
                    color: {
                        background: 'black',
                        border: 'white'
                    },
                    shape: 'circle',
                    font: {
                        color: 'white'
                    },
                    margin: {
                        top: 12,
                        left: 12
                    },
                    value: 1,
                    scaling: {
                        label: {
                            min: 25,
                            max: 25
                        }
                    }
                },
                edges: {
                    chosen: false
                },
                layout: {
                    hierarchical: {
                        enabled: true,
                        levelSeparation: 120,
                        direction: 'LR', // UD, DU, LR, RL
                        sortMethod: 'directed' // hubsize, directed
                    }
                }
            });
        }

        return () => {
            network.destroy();
        };
    }, [graph]);

    return <div ref={divRef} className="w-full h-96"></div>;
}

export default GraphDrawer;
