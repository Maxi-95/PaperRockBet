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
