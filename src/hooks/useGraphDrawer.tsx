import React, { useEffect, useState } from 'react';
import RGraph from '../objects/RGraph';
import { DataSet, Edge, Network, Node } from 'vis-network/standalone';

function useGraphDrawer(scope: HTMLDivElement | null, graph: RGraph | undefined) {
    const [network, setNetwork] = useState<Network | null>(null);

    useEffect(() => {
        if (!scope || !graph) return;

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
        let visited: string[] = [];
        let level = 1;
        while (next_lv.length != 0) {
            const actual_lv = [...next_lv];
            next_lv = [];

            for (const st of actual_lv) {
                if (visited.includes(st.ID)) continue;
                visited.push(st.ID);

                nodes_array.push({
                    id: st.ID,
                    label: st.getLabel(),
                    x: level
                });

                next_lv.push(...st.connections.map((cn) => cn.next));
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

        const net = new Network(scope, data, {
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
                // smooth: true
            },
            physics: {
                solver: 'forceAtlas2Based',
                timestep: 1
            },
            layout: {
                randomSeed: 'asdfasd'
            }
        });

        // network.updateClusteredNode(0, {});
        setNetwork(net);

        return () => {
            if (network) network.destroy();
            setNetwork(null);
        };
    }, [graph]);

    return network;
}

export default useGraphDrawer;
