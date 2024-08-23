const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let players = [];

wss.on("connection", (ws) => {
   if (players.length < 2) {
      players.push(ws);
      ws.send("Esperando a otro jugador...");
   }

   if (players.length === 2) {
      players.forEach((player, index) => {
         player.send(`Jugador ${index + 1} conectado. Comienza el juego.`);
      });

      ws.on("message", (message) => {
         // Enviar el mensaje del jugador al otro jugador
         players.forEach((player) => {
            if (player !== ws) {
               player.send(message);
            }
         });
      });

      ws.on("close", () => {
         players = players.filter((player) => player !== ws);
         players.forEach((player) => {
            player.send("El otro jugador se ha desconectado.");
         });
      });
   } else {
      ws.send("Sala completa.");
      ws.close();
   }
});

server.listen(8080, () => {
   console.log("Servidor escuchando en el puerto 8080");
});
