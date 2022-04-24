const { Server, Origins } = require('boardgame.io/server');
const { ThaiCrossword } = require('./game/game');


const server = Server({
  games: [ThaiCrossword],
  origins: [Origins.LOCALHOST],
});

server.run(8000);