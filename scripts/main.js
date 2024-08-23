document.addEventListener("DOMContentLoaded", () => {
   const socket = new WebSocket("ws://localhost:8080");

   let playerBet = 0;
   let playerBalance = 1000;
   const MINIMUM_BET = 250;

   const balanceDiv = document.getElementById("player-balance");
   const resultDiv = document.getElementById("result");
   const betInput = document.getElementById("player-bet");
   const placeBetButton = document.getElementById("place-bet");
   const reloadBalanceButton = document.getElementById("reload-balance");
   const buttons = document.querySelectorAll(".choice");

   function updateBalance() {
      balanceDiv.textContent = `Saldo: $${playerBalance}`;
   }

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
         socket.send(playerChoice); // Enviar la elección al servidor
      });
   });

   socket.addEventListener("message", (event) => {
      const opponentChoice = event.data;

      if (opponentChoice === "Esperando a otro jugador...") {
         resultDiv.textContent = opponentChoice;
      } else {
         const playerChoice = document
            .querySelector(".choice.selected")
            .getAttribute("data-choice");
         const result = playGame(playerChoice, opponentChoice);

         if (result.includes("Jugador 1")) {
            playerBalance += playerBet; // Gana el jugador
         } else if (result.includes("Jugador 2")) {
            playerBalance -= playerBet; // Pierde el jugador
         }

         resultDiv.textContent = `Tu elección: ${playerChoice}, Oponente: ${opponentChoice}. ${result}`;
         updateBalance(); // Actualiza el saldo después del juego
         playerBet = 0; // Reinicia la apuesta para la próxima ronda
         betInput.value = "";
      }
   });

   reloadBalanceButton.addEventListener("click", () => {
      playerBalance += 500;
      updateBalance();
      resultDiv.textContent = `Tu saldo ha sido recargado con $500.`;
   });

   updateBalance();
});
