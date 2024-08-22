// Archivo: scripts/main.js

// Aquí iniciará la lógica básica para el juego de piedra, papel o tijeras

console.log("¡Bienvenido a RockPaperDuel!");

// Por ejemplo, puedes empezar por definir las opciones
const options = ["piedra", "papel", "tijeras"];

// Lógica básica para el juego
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

// Ejemplo de uso:
console.log(playGame("piedra", "tijeras")); // Debería decir: ¡Jugador 1 gana!

document.addEventListener("DOMContentLoaded", () => {
   const buttons = document.querySelectorAll(".choice");
   const resultDiv = document.getElementById("result");
   const betInput = document.getElementById("player-bet");
   const placeBetButton = document.getElementById("place-bet");

   let playerBet = 0;

   placeBetButton.addEventListener("click", () => {
      const betValue = parseFloat(betInput.value);
      if (isNaN(betValue) || betValue <= 0) {
         resultDiv.textContent = "Por favor, ingrese una apuesta válida.";
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
         const computerChoice = getRandomChoice();
         const result = playGame(playerChoice, computerChoice);

         if (result.includes("Jugador 1")) {
            resultDiv.textContent = `Jugador eligió: ${playerChoice}, Computadora eligió: ${computerChoice}. ${result} ¡Ganaste $${playerBet * 2}!`;
         } else if (result.includes("Computadora")) {
            resultDiv.textContent = `Jugador eligió: ${playerChoice}, Computadora eligió: ${computerChoice}. ${result} ¡Perdiste $${playerBet}!`;
         } else {
            resultDiv.textContent = `Jugador eligió: ${playerChoice}, Computadora eligió: ${computerChoice}. ${result}`;
         }

         // Reinicia la apuesta para la próxima ronda
         playerBet = 0;
         betInput.value = "";
      });
   });

   function getRandomChoice() {
      const options = ["piedra", "papel", "tijeras"];
      const randomIndex = Math.floor(Math.random() * options.length);
      return options[randomIndex];
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
         return "¡Computadora gana!";
      }
   }
});
