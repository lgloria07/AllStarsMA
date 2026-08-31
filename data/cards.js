// ======================================================
// CARTAS DEL JUEGO
// ======================================================
//
// Todas las cartas del juego se configuran aquí.
//
// Para agregar una carta nueva solamente necesitas
// agregar otro objeto dentro de CARDS.
//
// ======================================================

export const CARDS = [

  // ====================================================
  // GOLPE
  // ====================================================

  {
    id: "normal_1",

    name: "Normal Punch",

    cost: 1,

    damage: 1,

    description: "Deal 1 damage.",

    // Imagen de la carta
    image: require("../assets/cards/Mario_Normal_Punch.png"),

    // Color de la parte superior e inferior
    color: "#FFFFFF",

    // Cantidad de copias en el mazo total
    copies: 3,
  },


  // ====================================================
  // GOLPE FUERTE
  // ====================================================

  {
    id: "normal_2",

    name: "Golpe fuerte",

    cost: 2,

    damage: 2,

    description: "Inflige 2 de daño.",

    image: require("../assets/cards/Mario_Normal_Punch.png"),

    color: "#FFB6B6",

    copies: 3,
  },


  // ====================================================
  // ATAQUE PODEROSO
  // ====================================================

  {
    id: "normal_3",

    name: "Ataque poderoso",

    cost: 3,

    damage: 4,

    description: "Inflige 4 de daño.",

    image: require("../assets/cards/Mario_Normal_Punch.png"),

    color: "#FF6B6B",

    copies: 3,
  },


  // ====================================================
  // CURACIÓN
  // ====================================================

  {
    id: "heal_1",

    name: "Curación",

    cost: 1,

    heal: 1,

    description: "Recupera 1 de vida.",

    image: require("../assets/cards/Mario_Normal_Punch.png"),

    color: "#FFF176",

    copies: 3,
  },

];