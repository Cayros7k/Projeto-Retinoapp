import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

function ImageButtons({ image, setImage }) {  // Define o componente ImageButtons com duas props: image e setImage
  const [cameraPermission, setCameraPermission] = useState(true);  // Define um estado para verificar a permissão da câmera
  const [galleryPermission, setGalleryPermission] = useState(true);  // Define um estado para verificar a permissão da galeria

<<<<<<< HEAD
  const grabFromLibrary = async () => {  // Função assíncrona para selecionar uma imagem da galeria
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();  // Solicita permissão para acessar a galeria
    if (galleryStatus.status == "granted") {  // Verifica se a permissão foi concedida
      let result = await ImagePicker.launchImageLibraryAsync({  // Abre a galeria para selecionar uma imagem
=======
  const grabFromLibrary = async () => {
    const galleryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus.status == "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
>>>>>>> parent of 491784e (Processing image method changed on the server)
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled && result.assets && result.assets.length > 0) {  // Verifica se a seleção de imagem não foi cancelada
        setImage(result.assets[0].uri);  // Define a imagem selecionada no estado
      }
    } else {
      setGalleryPermission(false);  // Define false para indicar que a permissão da galeria não foi concedida
    }
  };

  const grabFromCamera = async () => {  // Função assíncrona para tirar uma foto com a câmera
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();  // Solicita permissão para acessar a câmera
    if (cameraStatus.status == "granted") {  // Verifica se a permissão foi concedida
      let result = await ImagePicker.launchCameraAsync({  // Abre a câmera para tirar uma foto
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {  // Verifica se a captura de imagem não foi cancelada
        setImage(result.assets[0].uri);  // Define a imagem capturada no estado
      }
    } else {
      setCameraPermission(false);  // Define false para indicar que a permissão da câmera não foi concedida
    }
  };

  return (
    <View
      style={image ? [styles.buttonsPosition] : [styles.buttonsWithoutImage]}  // Define o estilo com base na presença ou ausência de uma imagem
    >
      <View style={styles.buttonsWrapper}> 
        <Pressable style={styles.button} onPress={grabFromCamera}> 
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {image ? "Tirar outra foto" : "Tirar uma foto"}
            </Text>
            <Ionicons name="camera-outline" size={24} color="white" /> 
          </View>
        </Pressable>
        <Pressable style={styles.button} onPress={grabFromLibrary}> 
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>
              {image ? "Selecionar outra imagem" : "Selecionar uma imagem"} 
            </Text>
            <MaterialIcons name="upload-file" size={24} color="white" /> 
          </View>
        </Pressable>
      </View>
      {!cameraPermission && (  // Exibe uma mensagem de erro se a permissão da câmera não foi concedida
        <Text style={styles.errorText}>
          Você precisa conceder acesso à câmera
        </Text>
      )}
      {!galleryPermission && (  // Exibe uma mensagem de erro se a permissão da galeria não foi concedida
        <Text style={styles.errorText}>
          Você precisa conceder acesso à galeria
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsWithoutImage: {  // Estilo para o componente quando não há imagem
    position: "absolute",
    top: "240%",
    left: "45%",
    transform: [{ translateX: -115 }],
  },
  buttonsPosition: {  // Estilo para o componente quando há uma imagem
    left: "29%",
    top: "5%",
    display: "flex",
    justifyContent: "center",
    transform: [{ translateX: -115 }],
  },
  buttonsWrapper: {  // Estilo para o envoltório dos botões
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {  // Estilo para os botões
    backgroundColor: "#4a90e2",
    padding: 20,
    borderRadius: 5,
    marginRight: 10,
    display: "flex",
    justifyContent: "center",
  },
  buttonContent: {  // Estilo para o conteúdo dos botões
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {  // Estilo para o texto dos botões
    color: "white",
    marginRight: 5,
  },
  errorText: {  // Estilo para a mensagem de erro
    color: "red",
  },
});

export default ImageButtons;  // Exporta o componente ImageButtons
