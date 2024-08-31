const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let nextPlayerId = 1; // Para asignar IDs únicos a los jugadores
let clients = {}; // Para almacenar a los jugadores conectados

wss.on("connection", (ws) => {
   const playerId = nextPlayerId++;
   clients[playerId] = ws;

   // Envía al jugador su ID
   ws.send(JSON.stringify({ playerId }));

   ws.on("message", (message) => {
      const parsedMessage = JSON.parse(message);
      const opponentId = Object.keys(clients).find((id) => id != playerId);

      // Reenvía el mensaje al oponente
      if (opponentId) {
         clients[opponentId].send(
            JSON.stringify({
               playerId: parsedMessage.playerId,
               choice: parsedMessage.choice,
            }),
         );
      }
   });

   ws.on("close", () => {
      delete clients[playerId]; // Elimina al jugador al desconectarse
   });
});

console.log("Servidor WebSocket corriendo en ws://localhost:8080");
