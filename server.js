const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
let players = {}; // Almacena las conexiones de los jugadores
let choices = {}; // Almacena las elecciones de los jugadores

wss.on("connection", (ws) => {
  // Asignar un ID único al jugador
  const playerId = Object.keys(players).length + 1;
  players[playerId] = ws;

  // Enviar ID único al jugador
  ws.send(JSON.stringify({ playerId }));

  // Manejar los mensajes recibidos de los jugadores
  ws.on("message", (message) => {
    const { playerId, choice } = JSON.parse(message);
    choices[playerId] = choice;

    // Si ambos jugadores han hecho una elección, resolver el juego
    if (choices[1] && choices[2]) {
      const resultPlayer1 = playGame(1, choices[1], choices[2]);
      const resultPlayer2 = playGame(2, choices[1], choices[2]);

      // Enviar los resultados a ambos jugadores
      players[1].send(JSON.stringify({ result: resultPlayer1 }));
      players[2].send(JSON.stringify({ result: resultPlayer2 }));

      // Reiniciar elecciones para la siguiente ronda
      choices = {};
    }
  });

  // Eliminar al jugador desconectado
  ws.on("close", () => {
    delete players[playerId];
    delete choices[playerId];
  });
});

// Función para resolver el resultado del juego
function playGame(playerId, player1Choice, player2Choice) {
  if (player1Choice === player2Choice) {
    return "¡Empate!";
  }

  const winningConditions = {
    piedra: "tijeras",
    tijeras: "papel",
    papel: "piedra",
  };

  if (winningConditions[player1Choice] === player2Choice) {
    return playerId === 1 ? "¡Jugador 1 gana!" : "¡Jugador 2 pierde!";
  } else {
    return playerId === 2 ? "¡Jugador 2 gana!" : "¡Jugador 1 pierde!";
  }
}

console.log("Servidor WebSocket corriendo en ws://localhost:8080");
