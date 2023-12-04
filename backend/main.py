import os
from fastapi import FastAPI, Depends
from neo4j import GraphDatabase, Driver
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv("db_connection.txt")

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))


def serialize_data_custom( record):
    """
    A custom serializer.

    Keyword arguments:
    index -- optional
    record -- required

    Record class documentation - https://neo4j.com/docs/api/python-driver/4.2/api.html#record
    """

    # Create an empty dictionary
    graph_data_type_list = {}
    # Iterate over the list of records also enumerating it.
    for j, graph_data_type in enumerate(record):
        # Check if the record has string or integer literal.
        if isinstance(graph_data_type, str) or isinstance(graph_data_type, int):
            # Return the keys and values of this record as a dictionary and store it inside graph_data_type_dict.
            graph_data_type_dict = record.data(j)
        else:
            # If the record fails the above check then manually convert them into dictionary with __dict__
            graph_data_type_dict = graph_data_type.__dict__
            # Remove unnecessary _graph as we do not need it to serialize from the record.
            if '_graph' in graph_data_type_dict:
                del graph_data_type_dict['_graph']
            # Add a _start_node key from the record.
            if '_start_node' in graph_data_type_dict:
                graph_data_type_dict['_start_node'] = graph_data_type_dict['_start_node'].__dict__
                # Add a _labels key of start node from the record.
                if '_labels' in graph_data_type_dict['_start_node']:
                    frozen_label_set = graph_data_type.start_node['_labels']
                    graph_data_type_dict['_start_node']['_labels'] = [v for v in frozen_label_set]
                # Remove unnecessary _graph as we do not need it to serialize from the record.
                if '_graph' in graph_data_type_dict['_start_node']:
                    del graph_data_type_dict['_start_node']['_graph']
            # Add a _start_node key from the record.
            if '_end_node' in graph_data_type_dict:
                graph_data_type_dict['_end_node'] = graph_data_type_dict['_end_node'].__dict__
                # Add a _labels key of start node from the record.
                if '_labels' in graph_data_type_dict['_end_node']:
                    frozen_label_set = graph_data_type.start_node['_labels']
                    graph_data_type_dict['_end_node']['_labels'] = [v for v in frozen_label_set]
                # Remove unnecessary _graph as we do not need it to serialize from the record.
                if '_graph' in graph_data_type_dict['_end_node']:
                    del graph_data_type_dict['_end_node']['_graph']
            # Add other labels for representation from frozenset()
            if '_labels' in graph_data_type_dict:
                frozen_label_set = graph_data_type_dict['_labels']
                graph_data_type_dict['_labels'] = [v for v in frozen_label_set]
            # print(graph_data_type_dict) # test statement
        graph_data_type_list.update(graph_data_type_dict)

    return graph_data_type_list


def get_driver():
    with GraphDatabase.driver(URI, auth=AUTH) as driver:
        yield driver


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/player_team/")
async def read_all(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (p:Player)-[e:PLAYS_IN]->(t:Team) Return p,e,t"
    )

    return [r.data() for r in records]


@app.get("/game_arena/")
async def read_game_arena(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (g:Game)-[e:TOOK_PLACE_AT]->(a:Arena) RETURN g,e,a;"
    )

    return [r.data() for r in records]


@app.get("/arena_team/")
async def read_arena_team(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (a:Arena)-[e:BELONGS_TO]->(t:Team) RETURN a,e,t;"
    )

    return [r.data() for r in records]


@app.get("/team_game/")
async def read_team_game(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (t:Team)-[e:TOOK_PART_IN]->(g:Game) RETURN t,e,g;"
    )

    return [r.data() for r in records]