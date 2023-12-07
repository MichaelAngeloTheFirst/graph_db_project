import { useRegisterEvents } from "@react-sigma/core";
import { useEffect } from "react";
import axios from "axios";
import {useGraphStore} from "@/stores/graphStore";




export default function GraphEvents() {
    const registerEvents = useRegisterEvents();
    const {fetchGraph} = useGraphStore();

    const deleteNode = async (nodeName : string) => {
        await axios.delete(`http://localhost:8000/node/${encodeURIComponent(nodeName)}/`)
        fetchGraph();
    }   

    useEffect(() => {

        registerEvents({
            doubleClickNode: (event) => console.log("doubleClickNode", event.event, event.node, event.preventSigmaDefault),
            rightClickNode: (event) => {
                console.log("rightClickNode",  event.node)
                console.log("rightClickNode",  deleteNode(event.node))

            },
        })

    
    },[registerEvents])


    return null;
}