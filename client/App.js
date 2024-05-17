import React, { useState } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { Button, Provider as PaperProvider, Appbar, BottomNavigation } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Define um componente de função App como o componente principal
export default function App() {
  return (
    <PaperProvider>
      <AppContainer />
    </PaperProvider>
  );
}

// Define um componente de função AppContainer para conter o conteúdo do aplicativo
function AppContainer() {
  // Define o estado 'index' e a função 'setIndex' para controlar a navegação
  const [index, setIndex] = useState(0);
  // Define o estado 'image' e a função 'setImage' para controlar a imagem selecionada
  const [image, setImage] = useState(null);
  // Define o estado 'result' e a função 'setResult' para controlar o resultado da detecção
  const [result, setResult] = useState(null);

  // Define uma matriz de rotas para a navegação entre telas
  const routes = [
    // Rota para as instruções de como tirar uma foto
    { key: 'instructions', title: 'Instructions', icon: 'info' },
    // Rota para a seleção de imagem
    { key: 'imagePicker', title: 'Image Picker', icon: 'image' },
    // Rota para exibir o resultado da detecção
    { key: 'result', title: 'Result', icon: 'check' },
  ];

  // Define uma função para renderizar o conteúdo com base na rota
  const renderScene = ({ route }) => {
    // Verifica a chave da rota
    switch (route.key) {
      // Se a chave da rota for 'instructions'
      case 'instructions':
        // Renderiza o componente InstructionsScreen
        return <InstructionsScreen setIndex={setIndex} />;
      // Se a chave da rota for 'imagePicker'
      case 'imagePicker':
        // Renderiza o componente ImagePickerExample
        return <ImagePickerExample setImage={setImage} setResult={setResult} setIndex={setIndex} />;
      // Se a chave da rota for 'result'
      case 'result':
        // Renderiza o componente ResultScreen
        return <ResultScreen image={image} result={result} />;
      // Caso contrário, retorna nulo
      default:
        return null;
    }
  };

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="RBAPP" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={styles.bottomNavigation}
        activeColor="#ffffff"
        inactiveColor="#a9a9a9"
      />
    </>
  );
}

// Componente de função para exibir instruções de como tirar uma foto
function InstructionsScreen({ setIndex }) {
  // Função para lidar com o botão de continuar
  const handleContinue = () => {
    // Muda para a tela do seletor de imagens
    setIndex(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionsText}>
        Siga as instruções abaixo para tirar uma foto corretamente:
      </Text>
      <Text style={styles.instructions}>
        1. Encontre um local bem iluminado.
      </Text>
      <Text style={styles.instructions}>
        2. Mantenha o objeto ou pessoa de interesse no centro da foto.
      </Text>
      <Text style={styles.instructions}>
        3. Evite reflexos ou sombras excessivas.
      </Text>
      <Text style={styles.instructions}>
        4. Aperte o botão para selecionar uma imagem e iniciar o processo de detecção.
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

// Componente de função para selecionar uma imagem
function ImagePickerExample({ setImage, setResult, setIndex }) {
  // Função para selecionar uma imagem
  const pickImage = async () => {
    // Chama a função para abrir a biblioteca de imagens
    let result = await ImagePicker.launchImageLibraryAsync({
      // Tipos de mídia permitidos
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // Permite a edição da imagem selecionada
      allowsEditing: true,
      // Proporção de aspecto da imagem
      aspect: [4, 3],
      // Qualidade da imagem
      quality: 1,
    });
    
    // Verifica se a seleção da imagem não foi cancelada
    if (!result.canceled) {
      // Obtém o URI da imagem selecionada
      const imageUri = result.assets[0].uri;
      // Atualiza o estado da imagem com o URI da imagem selecionada
      setImage(imageUri);
      
      // Define os cabeçalhos para a operação de upload
      const uploadHeaders = {
        // Define o tipo de conteúdo para multipart/form-data
        'content-type': 'multipart/form-data',
      };

      // Envia a imagem selecionada para o servidor
      const response = await FileSystem.uploadAsync(
        "https://7e70-2804-d45-e08d-9100-c4c9-f921-4937-1047.ngrok-free.app/predict",
        // URI da imagem selecionada
        imageUri,
        {
          // Nome do campo no formulário de upload
          fieldName: "image",
          // Define o tipo de upload como multipart
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          // Passa os cabeçalhos para a operação de upload
          headers: uploadHeaders,
        }
      );

      // Analisa a resposta do servidor como JSON
      const jsonResponse = JSON.parse(response.body);
      // Atualiza o estado do resultado com a resposta do servidor
      setResult(jsonResponse);

      // Muda para a tela de resultados
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

// Componente de função para exibir o resultado da detecção
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
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#000',
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
});
