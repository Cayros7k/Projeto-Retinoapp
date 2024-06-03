import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { Button, Provider as PaperProvider, Appbar, BottomNavigation, Modal, Portal, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function App() {
  return (
    <PaperProvider>
      <AppContainer />
    </PaperProvider>
  );
}

function AppContainer() {
  const [index, setIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  const routes = [
    { key: 'instructions', title: 'Instructions', icon: 'info' },
    { key: 'imagePicker', title: 'Image Picker', icon: 'image' },
    { key: 'result', title: 'Result', icon: 'check' },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'instructions':
        return <InstructionsScreen setIndex={setIndex} />;
      case 'imagePicker':
        return <ImagePickerExample setImage={setImage} setResult={setResult} setIndex={setIndex} />;
      case 'result':
        return <ResultScreen image={image} result={result} />;
      default:
        return null;
    }
  };

  const hideModal = () => setModalVisible(false);

  return (
    <Provider>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="RetinoAPP" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.bottomNavigation}
        activeColor="#ffffff"
        inactiveColor="#a9a9a9"
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalText}>Este aplicativo não substitui o diagnóstico clínico.</Text>
          <Button mode="contained" onPress={hideModal} style={styles.button} labelStyle={styles.buttonLabel}>
            Fechar
          </Button>
        </Modal>
      </Portal>
    </Provider>
  );
}

function InstructionsScreen({ setIndex }) {
  const handleContinue = () => {
    setIndex(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionsText}>
        Siga as instruções abaixo para tirar uma foto corretamente:
      </Text>
      <Text style={styles.instructions}>
        1. Escolha uma foto com uma boa qualidade.
      </Text>
      <Text style={styles.instructions}>
        2. Enquadre um dos olhos.
      </Text>
      <Text style={styles.instructions}>
        3. Aviso: Não leve o resultado desta análise como um exame clínicos.
      </Text>
      <Button
        mode="contained"
        onPress={handleContinue}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Continuar
      </Button>
    </View>
  );
}

function ImagePickerExample({ setImage, setResult, setIndex }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);

      const uploadHeaders = {
        'content-type': 'multipart/form-data',
      };

      const response = await FileSystem.uploadAsync(
        "https://8902-189-50-3-114.ngrok-free.app/predict",
        imageUri,
        {
          fieldName: "image",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: uploadHeaders,
        }
      );

      const jsonResponse = JSON.parse(response.body);
      setResult(jsonResponse);
      setIndex(2);
    }
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
    </View>
  );
}

function ResultScreen({ image, result }) {
  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Previsão: {result.predicted_class}</Text>
          <Text style={styles.resultText}>Porcentagem: {result.confidence}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: '#000',
  },
  appbarTitle: {
    color: '#ffffff',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    flex: 1,
    flexDirection: 'column'
  },
  instructionsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4F4F4F',
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
  resultContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 8,
  },
  bottomNavigation: {
    backgroundColor: '#000', 
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'auto'
  },
});
