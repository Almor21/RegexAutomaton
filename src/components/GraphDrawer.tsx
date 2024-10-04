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
                // color: {
                //     border: 'black'
                // },
                x: 0
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

        let next_lv = [graph.initState];
        let visited = [graph.initState.ID];
        let level = 1;
        while (next_lv.length != 0) {
            const actual_lv = [...next_lv];
            next_lv = [];

            for (const st of actual_lv) {
                visited.push(st.ID);

                nodes_array.push({
                    id: st.ID,
                    label: st.getLabel(),
                    x: level
                });

                next_lv.push(
                    ...st.connections
                        .map((cn) => cn.next)
                        .filter((s) => !visited.includes(s.ID))
                );
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

            level++;
        }

        const nodes = new DataSet<Node>(nodes_array);
        const edges = new DataSet<Edge>(edges_array);

        const data = {
            nodes: nodes,
            edges: edges
        };

        if (divRef.current) {
            network = new Network(divRef.current, data, {
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
                physics: {
                    timestep: 1
                }
            });
        }

        return () => {
            network.destroy();
        };
    }, [graph]);

    return (
        <div ref={divRef} className="w-full h-full"></div>
    );
}

export default GraphDrawer;
