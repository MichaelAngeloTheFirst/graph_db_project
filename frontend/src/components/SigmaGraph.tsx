import { useEffect } from "react";
import {
  SigmaContainer,
  useLoadGraph,
  ControlsContainer,
  FullScreenControl,
  ZoomControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {useGraphStore} from "../stores/graphStore";
import GraphEvents from "./GraphEvents"
import {LayoutForceControl} from "@react-sigma/layout-force"

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();
  const { graph } = useGraphStore();
  // const {  assign } = useLayoutForce();


  useEffect(() => {

    console.log(graph);

    loadGraph(graph);

  }, [loadGraph, graph]);


  return null;
};

export const SigmaGraph = () => {
  return (
    <SigmaContainer style={{ height: "600px", width: "800px" }} settings={{renderEdgeLabels: true,edgeLabelSize :10, defaultEdgeType : 'arrow',enableEdgeClickEvents: true, labelDensity: 1, labelSize:10, labelWeight: '0.7' }} >
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <LayoutForceControl/>
        <FullScreenControl />
      </ControlsContainer>
      <GraphEvents />
      <LoadGraph />
    </SigmaContainer>
  );
};
