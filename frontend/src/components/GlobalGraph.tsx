import React, { useEffect } from "react";
import {useGraphStore} from "../stores/graphStore"




export default function GlobalGraph({children} : {children : React.ReactNode}) {
    const {fetchGraph} = useGraphStore();

    useEffect(() => {
        fetchGraph();
    },[fetchGraph])

    return <>{children}</>
}