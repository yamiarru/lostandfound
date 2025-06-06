import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/fb";
import { useNavigation } from "@react-navigation/native";

export default function UserProfileForm() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const profileRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(profileRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setSurname(data.surname || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setImageBase64(data.photoBase64 || null);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImageBase64(`data:image/jpeg;base64,${selectedAsset.base64}`);
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No hay un usuario autenticado.");
        return;
      }

      const profileRef = doc(db, "users", user.uid);

      await setDoc(profileRef, {
        name,
        surname,
        phone,
        address,
        photoBase64: imageBase64 || null,
        email: user.email,
      });

      Alert.alert("Perfil guardado", "Tu perfil se ha guardado correctamente.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      Alert.alert("Error", "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    navigation.goBack();
  };

  if (initialLoading) {
    return (
      <ScrollView contentContainerStyle={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellido"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      {imageBase64 && (
        <>
          <Image source={{ uri: imageBase64 }} style={styles.image} />
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cambiar imagen de perfil</Text>
          </TouchableOpacity>
        </>
      )}

      {!imageBase64 && (
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Cargar imagen de perfil</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSpacing} />

      <TouchableOpacity
        onPress={saveProfile}
        disabled={loading}
        style={[styles.saveButton, loading && { opacity: 0.6 }]}>
        <Text style={styles.saveButtonText}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "stretch",
    backgroundColor: "#fbfaf4",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fbfaf4",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 12,
    alignSelf: "center",
  },
  imageButton: {
    backgroundColor: "#8DA290",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  imageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#8DA290",
    borderRadius: 8,
    padding: 10,
    marginTop: 150,
    marginBottom: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "60%",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 10,
    marginBottom: 40,
    alignSelf: "center",
  },
  cancelButtonText: {
    color: "#8DA290",
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 60,
  },
});
