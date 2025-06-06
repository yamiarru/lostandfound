import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import { useState, useContext } from "react";
import { auth } from "../config/fb";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../AuthProvider";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigation.navigate("Main");
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.textInput}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.loginButton} onPress={signIn}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert("Recuperación de contraseña", "Funcionalidad no implementada aún.")}> 
        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("NewAccountScreen")}> 
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfaf4",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 30,
    color: "#000",
  },
  textInput: {
    height: 50,
    width: "85%",
    backgroundColor: "#fff",
    borderColor: "#DEE2D9",
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    width: "85%",
    backgroundColor: "#F2CBBB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    marginTop: 12,
    color: "#8DA290",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
});
