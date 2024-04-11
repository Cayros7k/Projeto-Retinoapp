import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import axios from "axios";

function SendButton({ image, prediction, setPrediction }) {
  const sendToServer = async () => {
<<<<<<< HEAD
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: "image/jpeg",
        name: "test.jpg",
=======
    axios
      .post("http://127.0.0.1:8000/predict/", formData)
      .then((response) => {
        setPrediction(response);
      })
      .catch((error) => {
        console.error(error);
>>>>>>> parent of 491784e (Processing image method changed on the server)
      });

      const response = await axios.post("http://127.0.0.1:8000/predict", formData);
      setPrediction(response.data); // Corrija para acessar os dados da resposta
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  return (
    <View style={styles.sendWrapper}>
      <Pressable style={styles.button} onPress={sendToServer}>
        <Text style={styles.buttonText}>Scan the image</Text> 
      </Pressable>
    </View>
  );
}

export default SendButton;

const styles = StyleSheet.create({
  sendWrapper: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: [{ translateX: -130 }, { translateY: 20 }],
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
