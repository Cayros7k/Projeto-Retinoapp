import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";

function SendButton({ image, prediction, setPrediction }) {
  const sendToServer = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'test.jpg',
      });

      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
    }
  };

  return (
    <View style={styles.sendWrapper}>
      <TouchableOpacity style={styles.button} onPress={sendToServer}>
        <Text style={styles.buttonText}>Scan the image</Text>
      </TouchableOpacity>
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
