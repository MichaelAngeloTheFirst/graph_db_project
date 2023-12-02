import { useEffect, useState } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();
  
  const [firstNode, setFirst ] = useState<string | null>(null);
  // const [secondNode, setSecond ] = useState<string | null>(null);

  const GraphEvents = (graph : Graph) => {
    const registerEvents = useRegisterEvents();

    useEffect(() => {
      registerEvents({
        clickNode: (event) => {
          console.log("Node clicked:", event);
          console.log("Node clicked:", event.node);
          if(firstNode === null) {
            setFirst(event.node);
          } else {
            graph.addEdgeWithKey("rel1", "first", "2nd", { label: "REL_1" });
            console.log("Edge added:", firstNode, event.node);
            setFirst(null);
          }
      
      }  })
    }, [graph, registerEvents]);


    return null;
  }

  


  useEffect(() => {
    const graph = new Graph();
    graph.addNode("first", { x: 0, y: 0, size: 15, label: "My first node", color: "#FA4F40" });
    graph.addNode("2nd", { x: 5, y: 5, size: 15, label: "My 2nd node", color: "#FA4F40" });
    // graph.addEdgeWithKey("rel1", "first", "2nd", { label: "REL_1" });

    // registerEvents({
    //   clickNode: (event) => {
    //     console.log("Node clicked:", event);
    //     console.log("Node clicked:", event.node);
    //     if(firstNode === null) {
    //       setFirst(event.node);
    //     } else {
    //       graph.addEdgeWithKey("rel1", "first", "2nd", { label: "REL_1" });
    //       loadGraph(graph);
    //       console.log("Edge added:", firstNode, event.node);
    //       setFirst(null);
    //     }
    
    // }  })

    
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const SigmaGraph = () => {
  return (
    <SigmaContainer style={{ height: "600px", width: "800px" }}   >
      <LoadGraph />
      <GraphEvents graph={}/>
    </SigmaContainer>
  );
};