import React, { useState } from 'react';
import { Image, View, StyleSheet, Alert, Platform } from 'react-native';
import { Button, Provider as PaperProvider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library'; // Corrigido aqui

export default function App() {
  return (
    <PaperProvider>
      <ImagePickerExample />
    </PaperProvider>
  );
}

export function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null); 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    const uploadHeaders = {
      'content-type': 'multipart/form-data',
    };

    const response = await FileSystem.uploadAsync(
      "https://c6a0-189-50-3-114.ngrok-free.app/predict",
      result.assets[0].uri,
      {
        fieldName: "image",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: uploadHeaders     
      }
    );

    const jsonResponse = JSON.parse(response.body);
    const predictedClass = jsonResponse.predicted_class;
    const confidenceShow = jsonResponse.confidence

    Alert.alert('Resultado:', `Predicted Class: ${predictedClass}\nConfidence: ${confidenceShow}`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setImage(null);
        },
      },
    ]);

    setResponse(jsonResponse);
  };

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={pickImage} 
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Selecione uma imagem
      </Button>
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  button: {
    marginBottom: 16,
  },
  buttonLabel: {
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 16,
  },
});
