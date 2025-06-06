import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../config/fb";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const logout = () => auth.signOut();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás segura/o que querés cerrar sesión?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: logout,
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const baseData = {
          name: "",
          surname: "",
          phone: "",
          address: "",
          photoBase64: "",
          email: currentUser.email || "",
        };

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData({ ...baseData, ...docSnap.data() });
        } else {
          setUserData(baseData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData.photoBase64 ? (
        <Image
          source={{ uri: userData.photoBase64 }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={require("../../assets/default-avatar.jpg")}
          style={styles.profileImage}
        />
      )}
      <Text style={styles.text}>
        Nombre: {userData.name || "(sin nombre)"} {userData.surname || ""}
      </Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
      <Text style={styles.text}>
        Teléfono: {userData.phone || "(sin teléfono)"}
      </Text>
      <Text style={styles.text}>
        Dirección: {userData.address || "(sin dirección)"}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: "#8DA290" }]}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: "#8DA290" }]}
          onPress={() => navigation.navigate("Subscription")}
        >
          <Text style={styles.buttonText}>Suscripción</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: "#ff4d4d" }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fbfaf4",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#ddd",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
    width: "100%",
  },
  customButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutContainer: {
    marginTop: "auto",
    width: "100%",
  },
});

export default ProfileScreen;
