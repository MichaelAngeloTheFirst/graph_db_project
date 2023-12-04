import { useEffect, useState } from "react";
import Graph from "graphology";
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import axios from "axios";

type PlayerNode = {
  Number : number,
  Lname : string,
}

type TeamNode = {
  Name : string,
  Funclub : string,
}

type ArenaNode = {
  Arena : string,
  Location : string,
}

type GameNode = {
  Game_nr : string,
  Date : string,
}



// type ConnectionTuples =  [PlayerNode,"PLAYS_IN",  TeamNode]; //lname : string, shirtNumber : number, Name : string, Funclub : string


export const LoadGraph = () => {
  const loadGraph = useLoadGraph();
  const graph = new Graph();

  const fetchPlayerTeam = async () => {
    const response = await axios.get("http://localhost:8000/player_team/", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    return response.data;
  };

  const fetchGameArena = async () => {
    const response = await axios.get("http://localhost:8000/game_arena/", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    return response.data;
  };

  const fetchArenaTeam = async () => {
    const response = await axios.get("http://localhost:8000/arena_team/", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    return response.data;
  }

  const fetchTeamGame = async () => {
    const response = await axios.get("http://localhost:8000/team_game/", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    return response.data;
  }

  useEffect(() => {
    let active = true

    async function run() {
      await Promise.resolve();
      if (!active) {
        return;
      }
      const playerteamdata : Array<{p : PlayerNode, e  : "PLAYS_IN", t : TeamNode}>  = await fetchPlayerTeam();
      playerteamdata.forEach((element, index)   => {
        console.log(element);
        console.log(element["p"]["Lname"]);
        if(!graph.hasNode(element["p"]["Lname"])){
          graph.addNode(element["p"]["Lname"], {size : 20,  x : index, y : Math.sin(index) , label: element["p"]["Lname"]})
        }
        if(!graph.hasNode(element["t"]["Name"])){
          graph.addNode(element["t"]["Name"], {color : "orange" ,size : 20,  x : 1.5*index - 0.5, y : 4 , label: element["t"]["Name"]})
        }
        if(!graph.hasEdge(element["p"]["Lname"], element["t"]["Name"])){
          graph.addEdgeWithKey(element["p"]["Lname"] + element["t"]["Name"], element["p"]["Lname"], element["t"]["Name"], {label : element["e"]})
        }


      });

      const gamearenadata : Array<{g : GameNode, e  : "TOOK_PLACE_AT", a : ArenaNode}>  = await fetchGameArena();
      gamearenadata.forEach((element, index)   => {
        console.log(element);
        console.log(element["g"]["Game_nr"]);
        if(!graph.hasNode(element["g"]["Game_nr"])){
          graph.addNode(element["g"]["Game_nr"], {color: "green", size : 20,  x : 1.5*index, y : 8 , label: element["g"]["Game_nr"]})
        }
        if(!graph.hasNode(element["a"]["Arena"])){
          graph.addNode(element["a"]["Arena"], {color : "blue" ,size : 20,  x : 4*index -1, y : 6 , label: element["a"]["Arena"]})
        }
        if(!graph.hasEdge(element["g"]["Game_nr"], element["a"]["Arena"])){
          graph.addEdgeWithKey(element["g"]["Game_nr"] + element["a"]["Arena"], element["g"]["Game_nr"], element["a"]["Arena"], {label : element["e"]})
        }
      });

      const arenateamdata : Array<{a : ArenaNode, e  : "BELONGS_TO", t : TeamNode}>  = await fetchArenaTeam();
      arenateamdata.forEach((element, index)   => {
        console.log(element);
        console.log(element["a"]["Arena"]);
        if(!graph.hasNode(element["a"]["Arena"])){
          graph.addNode(element["a"]["Arena"], {color: "blue", size : 20,  x : 10*index , y : 6, label: element["a"]["Arena"]})
        }
        if(!graph.hasNode(element["t"]["Name"])){
          graph.addNode(element["t"]["Name"], {color : "orange" ,size : 20,  x : 1.5*index, y : 12 , label: element["t"]["Name"]})
        }
        if(!graph.hasEdge(element["a"]["Arena"], element["t"]["Name"])){
          graph.addEdgeWithKey(element["a"]["Arena"] + element["t"]["Name"], element["a"]["Arena"], element["t"]["Name"], {label : element["e"]})
        }
      });

      const teamgamedata : Array<{t : TeamNode, e  : "PLAYED_IN", g : GameNode}>  = await fetchTeamGame();
      teamgamedata.forEach((element, index)   => {
        console.log(element);
        console.log(element["t"]["Name"]);
        if(!graph.hasNode(element["t"]["Name"])){
          graph.addNode(element["t"]["Name"], {color: "orange", size : 20,  x : 1.5*index, y : 12 , label: element["t"]["Name"]})
        }
        if(!graph.hasNode(element["g"]["Game_nr"])){
          graph.addNode(element["g"]["Game_nr"], {color : "green" ,size : 20,  x : 1.5*index, y : 8 , label: element["g"]["Game_nr"]})
        }
        if(!graph.hasEdge(element["t"]["Name"], element["g"]["Game_nr"])){
          graph.addEdgeWithKey(element["t"]["Name"] + element["g"]["Game_nr"], element["t"]["Name"], element["g"]["Game_nr"], {label : element["e"]})
        }
      });
      loadGraph(graph);
    }

    run();
    return () => {
      active = false;
    };

  }, [loadGraph]);


  return null;
};

export const SigmaGraph = () => {
  return (
    <SigmaContainer style={{ height: "600px", width: "800px" }}>
      <LoadGraph />
    </SigmaContainer>
  );
};
