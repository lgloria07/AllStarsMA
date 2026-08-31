const characters = [
  {
    id: 1,
    name: "Naruto",
    selectionImage: require("../assets/naruto1.png"),
    characterImage: require("../assets/naruto2.jpg"),
    initialLife: 20,
    passive: "If you are the last player with energy remaining, your attacks deal an additional 1 damage",
  },

  {
    id: 2,
    name: "Mario",
    selectionImage: require("../assets/mario1.png"),
    characterImage: require("../assets/mario2.png"),
    initialLife: 20,
    passive: "The first time you reach 10 gold, gain an additional 5 gold",
  },

  {
    id: 3,
    name: "Jinx",
    selectionImage: require("../assets/jinx1.png"),
    characterImage: require("../assets/jinx2.jpg"),
    initialLife: 20,
    passive: "If you run out of energy before the other players, draw a card and gain 2 energy (once per round)",
  },
];

export default characters;