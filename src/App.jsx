import React from 'react';
import { Client } from "boardgame.io/react";
import { ThaiCrossword } from './game/game';
import { SocketIO } from "boardgame.io/multiplayer";
import ThaiBoard from './game/thaiBoard';
import { useParams } from "react-router-dom";

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;

const ThaiBoardClient = Client({
  game: ThaiCrossword,
  board: ThaiBoard,
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  debug: true,
});

const App = () => {
  let params = useParams();
  return (
    <div>
      <ThaiBoardClient playerID={params.playerID}/>
    </div>
  );
};

export default App;
