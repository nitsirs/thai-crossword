import React from 'react';
import { Client } from "boardgame.io/react";
import { ThaiCrossword } from './game/game';
import { SocketIO } from "boardgame.io/multiplayer";
import ThaiBoard from './game/thaiBoard';
import { useParams } from "react-router-dom";
import { Local } from 'boardgame.io/multiplayer';

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;

const ThaiBoardClient = Client({
  game: ThaiCrossword,
  board: ThaiBoard,
  multiplayer: Local(), //TODO: change this to SocketIO(server) or firebase
  debug: true,
});

const App = () => {
  let params = useParams();
  return (
    <div>
      <ThaiBoardClient playerID="0"/> 
    </div>
  );
};

export default App;
