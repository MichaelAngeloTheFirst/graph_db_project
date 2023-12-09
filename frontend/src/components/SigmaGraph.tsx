import { useEffect } from "react";
import {
  SigmaContainer,
  useLoadGraph,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {useGraphStore} from "../stores/graphStore";
import GraphEvents from "./GraphEvents"



// type PlayerNode = {
//   Number : number,
//   Lname : string,
// }

// type TeamNode = {
//   Name : string,
//   Funclub : string,
// }

// type ArenaNode = {
//   Arena : string,
//   Location : string,
// }

// type GameNode = {
//   Game_nr : string,
//   Date : string,
// }



// type ConnectionTuples =  [PlayerNode,"PLAYS_IN",  TeamNode]; //lname : string, shirtNumber : number, Name : string, Funclub : string


export const LoadGraph = () => {
  const loadGraph = useLoadGraph();
  const { graph } = useGraphStore();



  useEffect(() => {

    console.log(graph);

    loadGraph(graph);

  }, [loadGraph, graph]);


  return null;
};

export const SigmaGraph = () => {
  return (
    <SigmaContainer style={{ height: "600px", width: "800px" }} settings={{renderEdgeLabels: true,edgeLabelSize :10, defaultEdgeType : 'arrow' }} >
      <GraphEvents />
      <LoadGraph />
    </SigmaContainer>
  );
};
