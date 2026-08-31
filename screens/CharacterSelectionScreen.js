import React, { useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";

import Svg, {
  Circle,
} from "react-native-svg";

import characters from "../data/characters";

const { width } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CARD_WIDTH = width - 32;
const CARD_HEIGHT = CARD_WIDTH * 0.56;

const CIRCLE_RADIUS = 42;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function CharacterSelectionScreen({ navigation }) {

  const [pressingId, setPressingId] = useState(null);

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const timer = useRef(null);

  // ==========================================
  // COMENZAR A MANTENER PRESIONADO
  // ==========================================

  const startPress = (character) => {

    setPressingId(character.id);

    progress.stopAnimation();
    scale.stopAnimation();

    progress.setValue(0);
    scale.setValue(1);

    // La imagen crece lentamente
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 1.06,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {

      if (finished) {
        navigation.navigate("Battle", {
          character: character,
        });

        setPressingId(null);
      }

    });

    timer.current = character.id;
  };

  // ==========================================
  // SOLTAR EL BOTÓN
  // ==========================================

  const cancelPress = () => {

    if (timer.current !== null) {

      progress.stopAnimation();
      scale.stopAnimation();

      Animated.parallel([
        Animated.timing(progress, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),

        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      timer.current = null;

      setPressingId(null);
    }
  };

  // ==========================================
  // PERSONAJE
  // ==========================================

  const renderCharacter = ({ item }) => {

    const isPressing = pressingId === item.id;

    /*
      El círculo utiliza el progreso global.
      Solo se muestra en el personaje que estamos
      manteniendo presionado.
    */

    const strokeDashoffset = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [
        CIRCLE_CIRCUMFERENCE,
        0,
      ],
    });

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                scale: isPressing ? scale : 1,
              },
            ],
          },
        ]}
      >

        <TouchableOpacity
          activeOpacity={1}
          delayLongPress={0}
          onPressIn={() => startPress(item)}
          onPressOut={cancelPress}
          style={styles.touchArea}
        >

          {/* IMAGEN */}

          <Image
            source={item.selectionImage}
            style={styles.characterImage}
            resizeMode="cover"
          />

          {/* OSCURECIMIENTO CUANDO SE PRESIONA */}

          {isPressing && (
            <View style={styles.progressOverlay}>

              <View style={styles.progressCircle}>

                <Svg
                  width={100}
                  height={100}
                  viewBox="0 0 100 100"
                >

                  {/* CÍRCULO DE FONDO */}

                  <Circle
                    cx="50"
                    cy="50"
                    r={CIRCLE_RADIUS}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="7"
                    fill="none"
                  />

                  {/* PROGRESO */}

                  <AnimatedCircle
                    cx="50"
                    cy="50"
                    r={CIRCLE_RADIUS}
                    stroke="#FFFFFF"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"

                    strokeDasharray={
                      CIRCLE_CIRCUMFERENCE
                    }

                    strokeDashoffset={
                      strokeDashoffset
                    }

                    rotation="-90"
                    origin="50, 50"
                  />

                </Svg>

                <View style={styles.progressTextContainer}>

                  <Text style={styles.progressText}>
                    HOLD
                  </Text>

                </View>

              </View>

            </View>
          )}

        </TouchableOpacity>

      </Animated.View>
    );
  };

  return (

    <View style={styles.container}>

      {/* ================================= */}
      {/* TÍTULO */}
      {/* ================================= */}

      <View style={styles.header}>

        <Text style={styles.title}>
          CHOOSE YOUR CHARACTER
        </Text>

        <Text style={styles.subtitle}>
          Mantén presionada una imagen
        </Text>

      </View>

      {/* ================================= */}
      {/* PERSONAJES */}
      {/* ================================= */}

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCharacter}

        contentContainerStyle={styles.list}

        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  // ==========================================
  // PANTALLA
  // ==========================================

  container: {
    flex: 1,

    backgroundColor: "#111111",
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    paddingTop: 55,
    paddingBottom: 22,

    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",

    fontSize: 24,

    fontWeight: "bold",

    letterSpacing: 1,

    textAlign: "center",
  },

  subtitle: {
    color: "rgba(255,255,255,0.55)",

    fontSize: 14,

    marginTop: 7,
  },

  // ==========================================
  // LISTA
  // ==========================================

  list: {
    paddingHorizontal: 16,

    paddingBottom: 30,

    gap: 18,
  },

  // ==========================================
  // TARJETA
  // ==========================================

  card: {
    width: CARD_WIDTH,

    height: CARD_HEIGHT,

    borderRadius: 18,

    overflow: "hidden",

    backgroundColor: "#222222",

    elevation: 7,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },

  touchArea: {
    flex: 1,
  },

  // ==========================================
  // IMAGEN
  // ==========================================

  characterImage: {
    width: "100%",

    height: "100%",
  },

  // ==========================================
  // PROGRESO
  // ==========================================

  progressOverlay: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: "rgba(0,0,0,0.40)",

    justifyContent: "center",
    alignItems: "center",
  },

  progressCircle: {
    width: 100,
    height: 100,

    justifyContent: "center",
    alignItems: "center",
  },

  progressTextContainer: {
    position: "absolute",

    justifyContent: "center",
    alignItems: "center",
  },

  progressText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "bold",

    letterSpacing: 1,
  },

});