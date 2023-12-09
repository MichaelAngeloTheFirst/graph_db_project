import { useRegisterEvents } from "@react-sigma/core";
import {useState, useEffect, useCallback } from "react";
import axios from "axios";
import {useGraphStore} from "@/stores/graphStore";
import { SigmaNodeEventPayload } from "sigma/sigma";

function splitStringOnFirstSpace(inputString: string): [string, string] {
    const index = inputString.indexOf(' ');
    
    if (index !== -1) {
        const firstPart = inputString.slice(0, index);
        const secondPart = inputString.slice(index + 1);

        return [firstPart, secondPart];
    } else {
        // If there is no space in the string, return the whole string as the first part,
        // and an empty string as the second part.
        return [inputString, ''];
    }
}


export default function GraphEvents() {
    const registerEvents = useRegisterEvents();
    const {graph,fetchGraph} = useGraphStore();
    const [firstNode, setFirstNode] = useState<string>("")
    const [nodeType, setNodeType] = useState<string>("")

    const deleteNode = useCallback(async (nodeName : string) => {
        await axios.delete(`http://localhost:8000/node/${encodeURIComponent(nodeName)}/`)
        fetchGraph();
    },[fetchGraph])   

    const deleteEdge = useCallback(async (event: SigmaNodeEventPayload) => {
        console.log(splitStringOnFirstSpace(event.edge));
        const [node1, node2] = splitStringOnFirstSpace(event.edge);
        const nodeType1 = graph.getNodeAttributes(node1).nodeType;
        const nodeType2 = graph.getNodeAttributes(node2).nodeType;
        if(nodeType1 === 'Player' && nodeType2 === 'Team'  ) {
            await axios.delete(`http://localhost:8000/edge_playerteam/${encodeURIComponent(node1)}/${encodeURIComponent(node2)}`)
            fetchGraph();
        }
        else if(nodeType1 === 'Arena' && nodeType2 === 'Team'  ) {
            await axios.delete(`http://localhost:8000/edge_arenateam/${encodeURIComponent(node1)}/${encodeURIComponent(node2)}`)
            fetchGraph();
        } else if(nodeType1 === 'Game' && nodeType2 === 'Arena'  ) {
            await axios.delete(`http://localhost:8000/edge_gamearena/${encodeURIComponent(node1)}/${encodeURIComponent(node2)}`)
            fetchGraph();
        } 
        else if(nodeType1 === 'Team' && nodeType2 === 'Game' ) {
            await axios.delete(`http://localhost:8000/edge_teamgame/${encodeURIComponent(node1)}/${encodeURIComponent(node2)}`)
            fetchGraph();
        }
        fetchGraph();
    },[fetchGraph, graph] )
        // const edgeId = event.edge;
        // await axios.delete(`http://localhost:8000/edge/${encodeURIComponent(edgeId)}/`)
    //     fetchGraph();
    // },[fetchGraph])




    const addEdge = useCallback(async (event: SigmaNodeEventPayload) => {
        const nodeName = event.node;
        console.log(nodeName);
        console.log(graph.getNodeAttributes(nodeName).nodeType);
        if (firstNode === "") {
            setFirstNode(nodeName)
            setNodeType(graph.getNodeAttributes(nodeName).nodeType)
        }else {
            const nodeName2 = event.node;
            const nodeType2 = graph.getNodeAttributes(nodeName2).nodeType;
            if(nodeType === 'Player' && nodeType2 === 'Team'  ) {
                await axios.post(`http://localhost:8000/add_edge_playerteam/`, {
                    "firstnode" : firstNode,
                    "secondnode" : nodeName2,
                })
                fetchGraph();
            }else if( nodeType === 'Team' && nodeType2 === 'Player'){
                await axios.post(`http://localhost:8000/add_edge_playerteam/`, {
                    "firstnode" : nodeName2,
                    "secondnode" : firstNode,
                })
                fetchGraph()
            }
            else if(nodeType === 'Arena' && nodeType2 === 'Team'  ) {
                await axios.post(`http://localhost:8000/add_edge_arenateam/`, {
                    "firstnode" : firstNode,
                    "secondnode" : nodeName2,
                })
                fetchGraph();
            }else if( nodeType === 'Team' && nodeType2 === 'Arena') {
                await axios.post(`http://localhost:8000/add_edge_arenateam/`, {
                    "firstnode" : nodeName2,
                    "secondnode" : firstNode,
                })
                fetchGraph()
            } else if(nodeType === 'Game' && nodeType2 === 'Arena'  ) {
                await axios.post(`http://localhost:8000/add_edge_gamearena/`, {
                    "firstnode" : firstNode,
                    "secondnode" : nodeName2,
                })
                fetchGraph();
            } else if(nodeType === 'Arena' && nodeType2 === 'Game'){
                await axios.post(`http://localhost:8000/add_edge_gamearena/`, {
                    "firstnode" : nodeName2,
                    "secondnode" : firstNode,
                })
                fetchGraph()
            }else if(nodeType === 'Team' && nodeType2 === 'Game' ) {
                await axios.post(`http://localhost:8000/add_edge_teamgame/`, {
                    "firstnode" : firstNode,
                    "secondnode" : nodeName2,
                })
                fetchGraph();
            }else if(nodeType === 'Game' && nodeType2 === 'Team'){
                await axios.post(`http://localhost:8000/add_edge_teamgame/`, {
                    "firstnode" : nodeName2,
                    "secondnode" : firstNode,
                })
                fetchGraph()
            } else {
                alert(`Invalid Edge. You cannot connect ${nodeType} and ${nodeType2}` ,);
                setFirstNode("")
                setNodeType("")
            }

            setFirstNode("")
            setNodeType("")
        }

    },[fetchGraph, firstNode, graph, nodeType])

    useEffect(() => {

        registerEvents({
            doubleClickNode: (event) => console.log("doubleClickNode", event.event, event.node, event.preventSigmaDefault),
            rightClickNode: (event) => {
                console.log("rightClickNode",  event.node)
                deleteNode(event.node)
            },
            clickNode: (event) => {
                addEdge(event)
            },
            rightClickEdge: (event) => {
                deleteEdge(event)
            },
        })

    
    },[registerEvents, graph, deleteNode, addEdge])


    return null;
}