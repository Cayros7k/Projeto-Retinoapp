import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

function ImageButtons({ image, setImage }) {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const camera = await ImagePicker.getCameraPermissionsAsync();
      const gallery = await ImagePicker.getMediaLibraryPermissionsAsync();
      setCameraPermission(camera.status === "granted");
      setGalleryPermission(gallery.status === "granted");
    })();
  }, []);

  const requestPermission = async (permissionType) => {
    const permission = permissionType === "camera" ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    return permission.status === "granted";
  };

  const handlePress = async (source) => {
    let permission;
    if (source === "camera") {
      permission = cameraPermission || (await requestPermission("camera"));
    } else {
      permission = galleryPermission || (await requestPermission("gallery"));
    }

    if (!permission) {
      Alert.alert("Permission required", `You need to grant access to the ${source}`, [{ text: "OK" }]);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.buttonsContainer, image ? styles.withImage : styles.withoutImage]}>
      <TouchableOpacity style={styles.button} onPress={() => handlePress("camera")}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{image ? "Retake a picture" : "Take a picture"}</Text>
          <Ionicons name="camera-outline" size={24} color="white" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handlePress("gallery")}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{image ? "Reupload an image" : "Upload an image"}</Text>
          <MaterialIcons name="upload-file" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    top: 10,
    left: "50%",
    transform: [{ translateX: -115 }],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  withImage: {
    top: "5%",
  },
  withoutImage: {
    top: "240%",
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 20,
    borderRadius: 5,
    marginRight: 10,
    display: "flex",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginRight: 5,
  },
});

export default ImageButtons;
  