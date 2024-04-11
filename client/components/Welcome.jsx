import React from "react";
import { Text, View, StyleSheet } from "react-native";

function Welcome() {  // Define o componente Welcome
  return (
    <View style={styles.center}> 
      <Text style={styles.title}>BEM-VINDO AO RETINOBLASAPP</Text>
      <Text style={styles.description}>Tire ou escolha uma foto para começar a análise de Retinoblastoma</Text>
    </View>
  );
}

const styles = StyleSheet.create({  // Estilos para o componente Welcome
  center: {  // Estilo para centralizar o conteúdo
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    top: "120%",  // Posicionamento superior
  },
  title: {  // Estilo para o título
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {  // Estilo para a descrição
    fontSize: 16,
    textAlign: "left",
    maxWidth: 330,  // Largura máxima do texto
    marginLeft: -30,  // Margem à esquerda para compensar o posicionamento do texto
    paddingHorizontal: 20,  // Preenchimento horizontal
  },
});

export default Welcome; // Exporta o componente Welcome