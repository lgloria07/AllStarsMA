import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function WelcomeScreen({ navigation }) {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        ALL STARS
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("CharacterSelection")
        }
      >

        <Text style={styles.buttonText}>
          CLICK TO CONTINUE
        </Text>

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 45,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 50,
  },

  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },

});