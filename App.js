import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";

import { CARDS } from "./data/cards";


// ======================================================
// CONFIGURACIÓN
// ======================================================

const MAX_HEALTH = 20;

const STARTING_ENERGY = 3;

const STARTING_HAND_SIZE = 4;

const MIN_HAND_SIZE = 4;


// ======================================================
// REVOLVER CARTAS
// ======================================================

function shuffle(array) {

  const newArray = [...array];

  for (
    let i = newArray.length - 1;
    i > 0;
    i--
  ) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      newArray[i],
      newArray[j],
    ] = [
      newArray[j],
      newArray[i],
    ];

  }

  return newArray;
}


// ======================================================
// CREAR CARTA INDIVIDUAL
// ======================================================

function createCard(card) {

  return {

    ...card,

    // Identificador único para distinguir
    // copias de la misma carta.

    uniqueId:
      `${card.id}_${Math.random()
        .toString(36)
        .substring(2, 10)}`,

  };

}


// ======================================================
// CREAR TODAS LAS CARTAS
// ======================================================
//
// Aquí se crea el conjunto TOTAL de cartas.
//
// Por ejemplo:
//
// Golpe x3
// Golpe fuerte x3
// Ataque poderoso x3
// Curación x3
//
// = 12 cartas
//
// Después se revuelven TODAS.
//
// ======================================================

function createFullDeck() {

  const deck = [];

  CARDS.forEach((card) => {

    const copies =
      card.copies || 1;

    for (
      let i = 0;
      i < copies;
      i++
    ) {

      deck.push(
        createCard(card)
      );

    }

  });

  return shuffle(deck);

}


// ======================================================
// DIVIDIR EL MAZO ENTRE LOS JUGADORES
// ======================================================
//
// Ejemplos:
//
// 12 cartas:
//
// Jugador 1 = 6
// Jugador 2 = 6
//
// 15 cartas:
//
// Jugador 1 = 7
// Jugador 2 = 8
//
// 13 cartas:
//
// Jugador 1 = 6
// Jugador 2 = 7
//
// La diferencia nunca será mayor a 1 carta.
// ======================================================

function splitDeck(fullDeck) {

  const middle =
    Math.floor(
      fullDeck.length / 2
    );


  const player1Deck =
    fullDeck.slice(
      0,
      middle
    );


  const player2Deck =
    fullDeck.slice(
      middle
    );


  return {

    player1Deck,

    player2Deck,

  };

}


// ======================================================
// CREAR JUGADOR
// ======================================================

function createPlayer(
  name,
  deck
) {

  return {

    name,

    health: MAX_HEALTH,

    energy: STARTING_ENERGY,

    // Mazo que le tocó al jugador

    deck,

    // Cartas que tiene actualmente en la mano

    hand: [],

    // Cartas que ya utilizó

    discard: [],

    // Carta que seleccionó para este turno

    selectedCard: null,

    // Indica si ya confirmó su acción

    confirmed: false,

  };

}


// ======================================================
// ROBAR CARTAS
// ======================================================
//
// El jugador roba hasta tener el número indicado.
//
// Si el mazo se acaba:
//
// DESCARTE → REVOLVER → NUEVO MAZO
//
// Esto ocurre solamente con las cartas de ESE jugador.
// ======================================================

function drawCards(
  player,
  targetSize
) {

  let deck =
    [...player.deck];

  let hand =
    [...player.hand];

  let discard =
    [...player.discard];


  while (
    hand.length < targetSize
  ) {

    // ================================================
    // EL MAZO ESTÁ VACÍO
    // ================================================

    if (
      deck.length === 0
    ) {

      // Si tampoco hay descarte,
      // ya no existen cartas para robar.

      if (
        discard.length === 0
      ) {

        break;

      }


      // ==============================================
      // REVOLVER DESCARTE
      // ==============================================

      deck =
        shuffle(discard);

      discard = [];

    }


    // ================================================
    // ROBAR CARTA
    // ================================================

    const card =
      deck.shift();


    if (!card) {
      break;
    }


    hand.push(card);

  }


  return {

    ...player,

    deck,

    hand,

    discard,

  };

}


function Card({
  card,
  selected,
  disabled,
  onPress,
}) {

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <View
        style={[
          styles.cardHeader,
          {
            backgroundColor: card.color || "#FFFFFF",
          },
        ]}
      >

        <Text
          style={styles.cardName}
          numberOfLines={1}
        >
          {card.name}
        </Text>

        <View style={styles.energyCost}>
          <Text style={styles.energyText}>
            {card.cost}
          </Text>
        </View>

      </View>

      <View style={styles.cardImage}>

        {card.image ? (
          <Image
            source={card.image}
            style={styles.cardImageContent}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.cardImagePlaceholder}>
            🃏
          </Text>
        )}

      </View>

      <View
        style={[
          styles.cardDescription,
          {
            backgroundColor: card.color || "#FFFFFF",
          },
        ]}
      >

        <Text style={styles.descriptionText}>
          {card.description}
        </Text>

      </View>

    </TouchableOpacity>
  );
}


// ======================================================
// ÁREA DEL JUGADOR
// ======================================================

function PlayerArea({

  player,

  onSelectCard,

  disabled,

}) {

  return (

    <View
      style={
        styles.playerArea
      }
    >

      {/* ============================================ */}
      {/* NOMBRE */}
      {/* ============================================ */}

      <View
        style={
          styles.playerHeader
        }
      >

        <Text
          style={
            styles.playerName
          }
        >
          {player.name}
        </Text>


        <Text
          style={
            styles.playerStatus
          }
        >

          {player.confirmed
            ? "✓ LISTO"
            : "Elige una carta"}

        </Text>

      </View>


      {/* ============================================ */}
      {/* VIDA Y ENERGÍA */}
      {/* ============================================ */}

      <View
        style={
          styles.statRow
        }
      >

        <Text
          style={
            styles.statText
          }
        >
          ❤️ {player.health}
        </Text>


        <Text
          style={
            styles.statText
          }
        >
          ⚡ {player.energy}
        </Text>

      </View>


      {/* ============================================ */}
      {/* BARRA DE VIDA */}
      {/* ============================================ */}

      <View
        style={
          styles.healthBarBackground
        }
      >

        <View

          style={[

            styles.healthBar,

            {

              width:
                `${Math.max(
                  0,
                  (
                    player.health /
                    MAX_HEALTH
                  ) * 100
                )}%`,

            },

          ]}

        />

      </View>


      {/* ============================================ */}
      {/* INFORMACIÓN DE CARTAS */}
      {/* ============================================ */}

      <View
        style={
          styles.deckInfo
        }
      >

        <Text
          style={
            styles.deckText
          }
        >
          🃏 Mazo: {player.deck.length}
        </Text>


        <Text
          style={
            styles.deckText
          }
        >
          🗑️ Descarte: {player.discard.length}
        </Text>


        <Text
          style={
            styles.deckText
          }
        >
          ✋ Mano: {player.hand.length}
        </Text>

      </View>


      {/* ============================================ */}
      {/* CARTAS DE LA MANO */}
      {/* ============================================ */}

      <ScrollView

        horizontal

        showsHorizontalScrollIndicator={
          false
        }

        contentContainerStyle={
          styles.hand
        }

      >

        {player.hand.map(
          (card) => {

            // Una carta no puede jugarse
            // si cuesta más energía
            // de la que tiene el jugador.

            const cannotPlay =
              card.cost >
                player.energy ||
              disabled ||
              player.confirmed;


            return (

              <Card

                key={
                  card.uniqueId
                }

                card={
                  card
                }

                selected={
                  player.selectedCard
                    ?.uniqueId ===
                  card.uniqueId
                }

                disabled={
                  cannotPlay
                }

                onPress={() =>
                  onSelectCard(card)
                }

              />

            );

          }
        )}

      </ScrollView>


      {/* ============================================ */}
      {/* PASAR */}
      {/* ============================================ */}

      <TouchableOpacity

        style={[

          styles.passButton,

          (
            player.confirmed ||
            disabled
          ) &&
            styles.passButtonDisabled,

        ]}

        disabled={
          player.confirmed ||
          disabled
        }

        onPress={() =>
          onSelectCard(null)
        }

      >

        <Text
          style={
            styles.passButtonText
          }
        >
          PASAR
        </Text>

      </TouchableOpacity>

    </View>

  );

}


// ======================================================
// APP
// ======================================================

export default function App() {

  // ====================================================
  // JUGADORES
  // ====================================================

  const [player1, setPlayer1] =
    useState(null);


  const [player2, setPlayer2] =
    useState(null);


  // ====================================================
  // RONDA
  // ====================================================

  const [round, setRound] =
    useState(1);


  // ====================================================
  // TURNO
  // ====================================================

  const [turn, setTurn] =
    useState(1);


  // ====================================================
  // REGISTRO
  // ====================================================

  const [gameLog, setGameLog] =
    useState([]);


  // ====================================================
  // GANADOR
  // ====================================================

  const [winner, setWinner] =
    useState(null);


  // ====================================================
  // INICIAR PARTIDA
  // ====================================================

  function initializeGame() {

    // ================================================
    // CREAR UN SOLO MAZO
    // ================================================

    const fullDeck =
      createFullDeck();


    // ================================================
    // DIVIDIRLO ENTRE LOS DOS
    // ================================================

    const {
      player1Deck,
      player2Deck,
    } =
      splitDeck(fullDeck);


    // ================================================
    // CREAR JUGADORES
    // ================================================

    let p1 =
      createPlayer(
        "Jugador 1",
        player1Deck
      );


    let p2 =
      createPlayer(
        "Jugador 2",
        player2Deck
      );


    // ================================================
    // CADA JUGADOR COME 4 CARTAS
    // ================================================

    p1 =
      drawCards(
        p1,
        STARTING_HAND_SIZE
      );


    p2 =
      drawCards(
        p2,
        STARTING_HAND_SIZE
      );


    // ================================================
    // GUARDAR
    // ================================================

    setPlayer1(p1);

    setPlayer2(p2);

    setRound(1);

    setTurn(1);

    setWinner(null);


    setGameLog([

      `La partida comienza con ${fullDeck.length} cartas.`,

      `Jugador 1 recibió ${player1Deck.length} cartas.`,

      `Jugador 2 recibió ${player2Deck.length} cartas.`,

    ]);

  }


  // ====================================================
  // INICIAR AUTOMÁTICAMENTE
  // ====================================================

  useEffect(() => {

    initializeGame();

  }, []);


  // ====================================================
  // SELECCIONAR CARTA
  // ====================================================

  function selectCard(
    playerNumber,
    card
  ) {

    if (
      winner ||
      !player1 ||
      !player2
    ) {

      return;

    }


    // ================================================
    // JUGADOR 1
    // ================================================

    if (
      playerNumber === 1
    ) {

      setPlayer1(
        (prev) => ({

          ...prev,

          selectedCard:
            card,

          confirmed:
            true,

        })
      );

    }


    // ================================================
    // JUGADOR 2
    // ================================================

    else {

      setPlayer2(
        (prev) => ({

          ...prev,

          selectedCard:
            card,

          confirmed:
            true,

        })
      );

    }

  }


  // ====================================================
  // ESPERAR A QUE AMBOS ELIJAN
  // ====================================================

  useEffect(() => {

    if (

      player1 &&

      player2 &&

      player1.confirmed &&

      player2.confirmed &&

      !winner

    ) {

      resolveTurn();

    }

  }, [

    player1?.confirmed,

    player2?.confirmed,

  ]);


  // ====================================================
  // EJECUTAR EFECTO DE CARTA
  // ====================================================

  function applyCardEffect(

    card,

    attacker,

    attackerHealth,

    targetHealth,

    log

  ) {

    let newAttackerHealth =
      attackerHealth;


    let newTargetHealth =
      targetHealth;


    // ================================================
    // DAÑO
    // ================================================

    if (
      card.damage
    ) {

      newTargetHealth -=
        card.damage;


      log.push(

        `${attacker} jugó ${card.name} y causó ${card.damage} de daño.`

      );

    }


    // ================================================
    // CURACIÓN
    // ================================================

    if (
      card.heal
    ) {

      newAttackerHealth +=
        card.heal;


      newAttackerHealth =
        Math.min(

          MAX_HEALTH,

          newAttackerHealth

        );


      log.push(

        `${attacker} jugó ${card.name} y recuperó ${card.heal} de vida.`

      );

    }


    return {

      attackerHealth:
        newAttackerHealth,

      targetHealth:
        newTargetHealth,

    };

  }


  // ====================================================
  // RESOLVER TURNO
  // ====================================================

  function resolveTurn() {

    if (
      !player1 ||
      !player2
    ) {

      return;

    }


    const card1 =
      player1.selectedCard;


    const card2 =
      player2.selectedCard;


    // ================================================
    // VIDA
    // ================================================

    let health1 =
      player1.health;


    let health2 =
      player2.health;


    // ================================================
    // ENERGÍA
    // ================================================

    let energy1 =
      player1.energy;


    let energy2 =
      player2.energy;


    // ================================================
    // MANOS
    // ================================================

    let hand1 =
      [...player1.hand];


    let hand2 =
      [...player2.hand];


    // ================================================
    // DESCARTES
    // ================================================

    let discard1 =
      [...player1.discard];


    let discard2 =
      [...player2.discard];


    // ================================================
    // REGISTRO
    // ================================================

    const newLog =
      [...gameLog];


    // ================================================
    // JUGADOR 1 JUEGA
    // ================================================

    if (card1) {

      // ----------------------------------------------
      // Gastar energía
      // ----------------------------------------------

      energy1 -=
        card1.cost;


      // ----------------------------------------------
      // Quitar de la mano
      // ----------------------------------------------

      hand1 =
        hand1.filter(

          (card) =>
            card.uniqueId !==
            card1.uniqueId

        );


      // ----------------------------------------------
      // Mandar al descarte
      // ----------------------------------------------

      discard1.push(
        card1
      );


      // ----------------------------------------------
      // Efecto
      // ----------------------------------------------

      const result =
        applyCardEffect(

          card1,

          "Jugador 1",

          health1,

          health2,

          newLog

        );


      health1 =
        result.attackerHealth;


      health2 =
        result.targetHealth;

    }


    // ================================================
    // JUGADOR 2 JUEGA
    // ================================================

    if (card2) {

      // ----------------------------------------------
      // Gastar energía
      // ----------------------------------------------

      energy2 -=
        card2.cost;


      // ----------------------------------------------
      // Quitar de la mano
      // ----------------------------------------------

      hand2 =
        hand2.filter(

          (card) =>
            card.uniqueId !==
            card2.uniqueId

        );


      // ----------------------------------------------
      // Mandar al descarte
      // ----------------------------------------------

      discard2.push(
        card2
      );


      // ----------------------------------------------
      // Efecto
      // ----------------------------------------------

      const result =
        applyCardEffect(

          card2,

          "Jugador 2",

          health2,

          health1,

          newLog

        );


      health2 =
        result.attackerHealth;


      health1 =
        result.targetHealth;

    }


    // ================================================
    // NO PERMITIR VIDA NEGATIVA
    // ================================================

    health1 =
      Math.max(
        0,
        health1
      );


    health2 =
      Math.max(
        0,
        health2
      );


    // ================================================
    // CREAR JUGADORES ACTUALIZADOS
    // ================================================

    let updatedP1 = {

      ...player1,

      health:
        health1,

      energy:
        energy1,

      hand:
        hand1,

      discard:
        discard1,

      selectedCard:
        null,

      confirmed:
        false,

    };


    let updatedP2 = {

      ...player2,

      health:
        health2,

      energy:
        energy2,

      hand:
        hand2,

      discard:
        discard2,

      selectedCard:
        null,

      confirmed:
        false,

    };


    // ================================================
    // COMPROBAR GANADOR
    // ================================================

    let gameWinner =
      null;


    if (
      health1 <= 0 &&
      health2 <= 0
    ) {

      gameWinner =
        "Empate";

      newLog.push(
        "⚔️ ¡Ambos jugadores han caído!"
      );

    }

    else if (
      health1 <= 0
    ) {

      gameWinner =
        "Jugador 2";

      newLog.push(
        "🏆 ¡Jugador 2 ha ganado!"
      );

    }

    else if (
      health2 <= 0
    ) {

      gameWinner =
        "Jugador 1";

      newLog.push(
        "🏆 ¡Jugador 1 ha ganado!"
      );

    }


    // ================================================
    // ROBAR HASTA 4
    // ================================================

    updatedP1 =
      drawCards(
        updatedP1,
        MIN_HAND_SIZE
      );


    updatedP2 =
      drawCards(
        updatedP2,
        MIN_HAND_SIZE
      );


    // ================================================
    // GUARDAR
    // ================================================

    setPlayer1(
      updatedP1
    );

    setPlayer2(
      updatedP2
    );

    setGameLog(
      newLog
    );


    // ================================================
    // SI TERMINÓ
    // ================================================

    if (gameWinner) {

      setWinner(
        gameWinner
      );

      return;

    }


    // ================================================
    // SIGUIENTE TURNO
    // ================================================

    setTurn(
      (prev) =>
        prev + 1
    );


    // ================================================
    // ¿PUEDE JUGAR JUGADOR 1?
    // ================================================

    const p1CanPlay =
      updatedP1.hand.some(

        (card) =>
          card.cost <=
          updatedP1.energy

      );


    // ================================================
    // ¿PUEDE JUGAR JUGADOR 2?
    // ================================================

    const p2CanPlay =
      updatedP2.hand.some(

        (card) =>
          card.cost <=
          updatedP2.energy

      );


    // ================================================
    // SI NINGUNO PUEDE JUGAR
    // ================================================

    if (
      !p1CanPlay &&
      !p2CanPlay
    ) {

      startNewRound(

        updatedP1,

        updatedP2

      );

    }

  }


  // ====================================================
  // NUEVA RONDA
  // ====================================================

  function startNewRound(
    currentPlayer1,
    currentPlayer2
  ) {

    const newRound =
      round + 1;


    // ================================================
    // REINICIAR ENERGÍA
    // ================================================

    let p1 = {

      ...currentPlayer1,

      energy:
        STARTING_ENERGY,

      selectedCard:
        null,

      confirmed:
        false,

    };


    let p2 = {

      ...currentPlayer2,

      energy:
        STARTING_ENERGY,

      selectedCard:
        null,

      confirmed:
        false,

    };


    // ================================================
    // ROBAR HASTA 4
    // ================================================

    p1 =
      drawCards(
        p1,
        MIN_HAND_SIZE
      );


    p2 =
      drawCards(
        p2,
        MIN_HAND_SIZE
      );


    // ================================================
    // GUARDAR
    // ================================================

    setPlayer1(p1);

    setPlayer2(p2);

    setRound(
      newRound
    );


    setGameLog(
      (prev) => [

        ...prev,

        `🔄 Comienza la ronda ${newRound}.`,

        "⚡ Ambos jugadores recuperan 3 de energía.",

      ]
    );

  }


  // ====================================================
  // REINICIAR PARTIDA
  // ====================================================

  function restartGame() {

    initializeGame();

  }


  // ====================================================
  // ESPERAR A QUE SE CREE EL JUEGO
  // ====================================================

  if (
    !player1 ||
    !player2
  ) {

    return (

      <SafeAreaView
        style={
          styles.container
        }
      >

        <View
          style={
            styles.loading
          }
        >

          <Text
            style={
              styles.loadingText
            }
          >
            Preparando partida...
          </Text>

        </View>

      </SafeAreaView>

    );

  }


  // ====================================================
  // INTERFAZ
  // ====================================================

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}

      <View
        style={
          styles.header
        }
      >

        <Text
          style={
            styles.title
          }
        >
          ⚔️ BATTLE CARDS
        </Text>


        <View
          style={
            styles.roundContainer
          }
        >

          <Text
            style={
              styles.roundText
            }
          >
            Ronda {round}
          </Text>


          <Text
            style={
              styles.turnText
            }
          >
            Turno {turn}
          </Text>

        </View>

      </View>


      {/* ============================================ */}
      {/* JUGADOR 2 */}
      {/* ============================================ */}

      <PlayerArea

        player={
          player2
        }

        onSelectCard={
          (card) =>
            selectCard(2, card)
        }

        disabled={
          !!winner
        }

      />


      {/* ============================================ */}
      {/* CENTRO */}
      {/* ============================================ */}

      <View
        style={
          styles.centerArea
        }
      >

        <Text
          style={
            styles.vsText
          }
        >
          VS
        </Text>


        {player1.confirmed &&
          player2.confirmed && (

            <Text
              style={
                styles.resolvingText
              }
            >
              ⚔️ Resolviendo...
            </Text>

          )}

      </View>


      {/* ============================================ */}
      {/* JUGADOR 1 */}
      {/* ============================================ */}

      <PlayerArea

        player={
          player1
        }

        onSelectCard={
          (card) =>
            selectCard(1, card)
        }

        disabled={
          !!winner
        }

      />


      {/* ============================================ */}
      {/* REGISTRO */}
      {/* ============================================ */}

      <View
        style={
          styles.logContainer
        }
      >

        <Text
          style={
            styles.logTitle
          }
        >
          Registro de batalla
        </Text>


        <ScrollView
          style={
            styles.log
          }

          contentContainerStyle={{
            paddingBottom: 10,
          }}
        >

          {gameLog

            .slice()

            .reverse()

            .map(

              (
                message,
                index
              ) => (

                <Text

                  key={
                    index
                  }

                  style={
                    styles.logText
                  }

                >
                  {message}
                </Text>

              )

            )}

        </ScrollView>

      </View>


      {/* ============================================ */}
      {/* GANADOR */}
      {/* ============================================ */}

      {winner && (

        <View
          style={
            styles.winnerOverlay
          }
        >

          <View
            style={
              styles.winnerBox
            }
          >

            <Text
              style={
                styles.winnerTitle
              }
            >
              🏆 ¡VICTORIA!
            </Text>


            <Text
              style={
                styles.winnerText
              }
            >

              {winner === "Empate"

                ? "¡Empate!"

                : `${winner} ha ganado`}

            </Text>


            <TouchableOpacity

              style={
                styles.restartButton
              }

              onPress={
                restartGame
              }

            >

              <Text
                style={
                  styles.restartText
                }
              >
                NUEVA PARTIDA
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      )}

    </SafeAreaView>

  );

}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#101010",
  },


  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },


  loadingText: {
    color: "#ffffff",
    fontSize: 18,
  },


  // ==================================================
  // HEADER
  // ==================================================

  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },


  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },


  roundContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 5,
  },


  roundText: {
    color: "#ffd700",
    fontWeight: "bold",
  },


  turnText: {
    color: "#aaa",
  },


  // ==================================================
  // JUGADOR
  // ==================================================

  playerArea: {
    padding: 10,
  },


  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  playerName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },


  playerStatus: {
    color: "#aaa",
    fontSize: 12,
  },


  // ==================================================
  // ESTADÍSTICAS
  // ==================================================

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },


  statText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },


  // ==================================================
  // VIDA
  // ==================================================

  healthBarBackground: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 5,
  },


  healthBar: {
    height: "100%",
    backgroundColor: "#e53935",
  },


  // ==================================================
  // INFORMACIÓN DEL MAZO
  // ==================================================

  deckInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },


  deckText: {
    color: "#888",
    fontSize: 10,
  },


  // ==================================================
  // MANO
  // ==================================================

  hand: {
    gap: 8,
    paddingVertical: 5,
  },


  // ==================================================
  // CARTA
  // ==================================================

  card: {
    width: 120,
    height: 160,
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#555",
  },


  cardSelected: {
    borderColor: "#ffd700",
    borderWidth: 4,
    transform: [
      {
        translateY: -8,
      },
    ],
  },


  cardDisabled: {
    opacity: 0.4,
  },


  cardHeader: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 7,
    backgroundColor: "#ffffff",
  },


  cardName: {
    color: "#111",
    fontSize: 10,
    fontWeight: "bold",
    flex: 1,
  },


  energyCost: {
    width: 25,
    height: 25,
    backgroundColor: "#5aa8d6",
    justifyContent: "center",
    alignItems: "center",
  },


  energyText: {
    color: "#ffffff",
    fontWeight: "bold",
  },


  cardImage: {
    height: 85,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },


  cardImageText: {
    fontSize: 40,
  },


  cardDescription: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },


  descriptionText: {
    color: "#111",
    fontSize: 10,
    textAlign: "center",
  },


  // ==================================================
  // PASAR
  // ==================================================

  passButton: {
    alignSelf: "center",
    backgroundColor: "#444",
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 3,
  },


  passButtonDisabled: {
    opacity: 0.4,
  },


  passButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },


  // ==================================================
  // CENTRO
  // ==================================================

  centerArea: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },


  vsText: {
    color: "#e53935",
    fontSize: 20,
    fontWeight: "900",
  },


  resolvingText: {
    color: "#ffd700",
    fontSize: 12,
  },


  // ==================================================
  // REGISTRO
  // ==================================================

  logContainer: {
    marginHorizontal: 10,
    marginTop: 5,
    backgroundColor: "#181818",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    maxHeight: 100,
  },


  logTitle: {
    color: "#ffd700",
    fontWeight: "bold",
    padding: 7,
  },


  log: {
    paddingHorizontal: 8,
  },


  logText: {
    color: "#aaa",
    fontSize: 11,
    marginBottom: 3,
  },


  // ==================================================
  // GANADOR
  // ==================================================

  winnerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },


  winnerBox: {
    backgroundColor: "#222",
    width: "80%",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffd700",
  },


  winnerTitle: {
    color: "#ffd700",
    fontSize: 28,
    fontWeight: "900",
  },


  winnerText: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 10,
  },


  restartButton: {
    backgroundColor: "#e53935",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },


  restartText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

});