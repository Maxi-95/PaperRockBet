let playerChoice = null;
let opponentChoice = null;
let playerId = null;
let playerBalance = 1000; // Saldo inicial del jugador
const MINIMUM_BALANCE = 10; // Saldo mínimo requerido para jugar
const MINIMUM_BET = 80; // Apuesta mínima permitida
const RELOAD_AMOUNT = 500; // Cantidad para recargar el saldo

// Funciones auxiliares

// Función para determinar el resultado del juego
function playGame(player1Choice, player2Choice) {
  if (player1Choice === player2Choice) {
    return "¡Empate!";
  }
  if (
    (player1Choice === "piedra" && player2Choice === "tijeras") ||
    (player1Choice === "papel" && player2Choice === "piedra") ||
    (player1Choice === "tijeras" && player2Choice === "papel")
  ) {
    return "¡Jugador 1 gana!";
  } else {
    return "¡Jugador 2 gana!";
  }
}

// Función para actualizar el saldo del jugador
function updateBalance() {
  const balanceDiv = document.getElementById("player-balance");
  balanceDiv.textContent = `Saldo: $${playerBalance}`;
}

// Función para reiniciar el juego
function resetGame() {
  playerChoice = null;
  opponentChoice = null;
  playerBet = 0;
  document.getElementById("player-bet").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://localhost:8080");

  // Variables y elementos del DOM
  let playerBet = 0;
  const balanceDiv = document.getElementById("player-balance");
  const buttons = document.querySelectorAll(".choice");
  const resultDiv = document.getElementById("result");
  const betInput = document.getElementById("player-bet");
  const placeBetButton = document.getElementById("place-bet");
  const reloadBalanceButton = document.getElementById("reload-balance");
  let playerId = null;
  let playerChoice = null;
  let opponentChoice = null;
  let gameResult = null;

  // Actualiza el saldo mostrado
  function updateBalance() {
    balanceDiv.textContent = `Saldo: $${playerBalance}`;
    checkBettingAbility();
  }

  // Verifica si el jugador puede hacer una apuesta
  function checkBettingAbility() {
    if (playerBalance < MINIMUM_BALANCE) {
      placeBetButton.disabled = true;
      resultDiv.textContent =
        "No tienes suficiente saldo para jugar. Recarga tu saldo.";
    } else {
      placeBetButton.disabled = false;
    }
  }

  updateBalance();

  placeBetButton.addEventListener("click", () => {
    const betValue = parseFloat(betInput.value);
    if (isNaN(betValue) || betValue <= 0) {
      resultDiv.textContent = "Por favor, ingrese una apuesta válida.";
      return;
    }
    if (betValue < MINIMUM_BET) {
      resultDiv.textContent = `La apuesta mínima es de $${MINIMUM_BET}.`;
      return;
    }
    if (betValue > playerBalance) {
      resultDiv.textContent =
        "No tienes suficiente saldo para hacer esa apuesta.";
      return;
    }

    playerBet = betValue;
    resultDiv.textContent = `Has apostado $${playerBet}. ¡Haz tu elección!`;
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (playerBet === 0) {
        resultDiv.textContent = "Primero, debes ingresar tu apuesta.";
        return;
      }

      const playerChoice = button.getAttribute("data-choice");
      sendChoice(playerChoice);
    });
  });

  reloadBalanceButton.addEventListener("click", () => {
    playerBalance += RELOAD_AMOUNT;
    updateBalance();
    resultDiv.textContent = `Tu saldo ha sido recargado con $${RELOAD_AMOUNT}.`;
  });

  function sendChoice(choice) {
    playerChoice = choice;
    socket.send(JSON.stringify({ playerId, choice }));
    resultDiv.textContent = "Esperando la elección del oponente...";
  }

  function checkGameResult() {
    if (gameResult.includes("gana")) {
      playerBalance += playerBet; // Suma la apuesta si gana el jugador
    } else if (gameResult.includes("pierde")) {
      playerBalance -= playerBet; // Resta la apuesta si pierde el jugador
    }

    updateBalance(); // Actualiza el saldo después del juego
    resultDiv.textContent = gameResult; // Mostrar el resultado del juego
    resetGame(); // Reiniciar juego para la siguiente ronda
  }

  socket.addEventListener("open", () => {
    console.log("Conectado al servidor WebSocket");
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.playerId && !playerId) {
      playerId = message.playerId;
      console.log(`Tu ID de jugador es: ${playerId}`);
    } else if (message.choice && message.playerId !== playerId) {
      opponentChoice = message.choice;
      checkGameResult();
    } else if (message.result) {
      gameResult = message.result;
      checkGameResult(); // Llamar al chequeo del resultado
    }
  });

  function resetGame() {
    playerChoice = null;
    opponentChoice = null;
    playerBet = 0;
    betInput.value = "";
  }
});
