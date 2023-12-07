import os
from fastapi import FastAPI, Depends
from neo4j import GraphDatabase, Driver
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from pydantic import BaseModel

app = FastAPI()


class Player(BaseModel):
    playernumber: int
    lastname: str


class Arena(BaseModel):
    arena: str
    location: str


class Team(BaseModel):
    name: str
    funclub: str


class Game(BaseModel):
    gamenr: str
    gamedate: str


origins = [
    "*",
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


def get_driver():
    with GraphDatabase.driver(URI, auth=AUTH) as driver:
        yield driver


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/player/")
async def player(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (p :Player) WHERE NOT (p) -->() RETURN p;"
    )
    return [r.data() for r in records]


@app.get("/team/")
async def team(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (t :Team) WHERE NOT (t) -->() RETURN t;"
    )
    return [r.data() for r in records]


@app.get("/game/")
async def game(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (g :Game) WHERE NOT (g) -->() RETURN g;"
    )
    return [r.data() for r in records]


@app.get("/arena/")
async def arena(driver: Annotated[Driver, Depends(get_driver)]):
    records, summary, keys = driver.execute_query(
        "MATCH (a :Arena) WHERE NOT (a) -->() RETURN a;"
    )
    return [r.data() for r in records]


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


@app.post("/add_player/")
async def add_player(player: Player, driver: Annotated[Driver, Depends(get_driver)]):
    driver.execute_query(
        "CREATE (:Player {Number : $number, Lname : $lname});",
        {"lname": player.lastname, "number": player.playernumber},
    )


@app.post("/add_team/")
async def add_team(team: Team, driver: Annotated[Driver, Depends(get_driver)]):
    driver.execute_query(
        "CREATE (:Team {Name : $name, Funclub : $funclub});",
        {"name": team.name, "funclub": team.funclub},
    )


@app.post("/add_arena/")
async def add_arena(arena: Arena, driver: Annotated[Driver, Depends(get_driver)]):
    driver.execute_query(
        "CREATE (:Arena {Arena : $arena, Location : $location});",
        {"arena": arena.arena, "location": arena.location},
    )


@app.post("/add_game/")
async def add_game(game: Game, driver: Annotated[Driver, Depends(get_driver)]):
    driver.execute_query(
        "CREATE (:Game {Game_nr : $game_nr, Date : $date});",
        {"game_nr": game.gamenr, "date": game.gamedate},
    )
    
@app.delete("/node/{node_name}")
async def delete_node(node_name: str, driver: Annotated[Driver, Depends(get_driver)]):
    driver.execute_query(
        "MATCH (n) WHERE ANY(key IN keys(n) WHERE n[key] = $node_name) DETACH DELETE n;",
        {"node_name": node_name},
    )
