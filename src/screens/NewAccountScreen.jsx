import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  View,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { auth } from "../config/fb";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../AuthProvider";

const NewAccountScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [showRepeatError, setShowRepeatError] = useState(false);

  const emailRegex = /\S+@\S+\.\S+/;
  const lettersOnly = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

  const validName = lettersOnly.test(name.trim());
  const validSurname = lettersOnly.test(surname.trim());
  const validEmail = emailRegex.test(email.trim());
  const passwordsMatch = password === repeatPassword && password !== "";

  useEffect(() => {
    setShowRepeatError(repeatPassword !== "" && password !== repeatPassword);

    if (validName && validSurname && validEmail && passwordsMatch) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [name, surname, email, password, repeatPassword]);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: `${name} ${surname}`,
        phoneNumber: phone,
      });

      setUser(userCredential.user);
      Alert.alert("Cuenta creada con éxito", "Ahora puedes iniciar sesión", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
          style={[
            styles.textInput,
            name !== "" && !validName && styles.errorInput,
          ]}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        <TextInput
          style={[
            styles.textInput,
            surname !== "" && !validSurname && styles.errorInput,
          ]}
          placeholder="Apellido"
          value={surname}
          onChangeText={setSurname}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.textInput}
          placeholder="Teléfono"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <TextInput
          style={[
            styles.textInput,
            email !== "" && !validEmail && styles.errorInput,
            { marginTop: 25 },
          ]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.textInput, { marginTop: 10 }]} // sin borde rojo nunca
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TextInput
          style={[
            styles.textInput,
            { marginTop: 10 },
            repeatPassword !== "" && !passwordsMatch && styles.errorInput,
          ]}
          placeholder="Repetir contraseña"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        {showRepeatError && (
          <Text style={styles.errorText}>La contraseña ingresada no coincide.</Text>
        )}

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF1D8",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingBottom: 80,
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
    marginBottom: 5,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    width: "85%",
    marginBottom: 10,
    textAlign: "left",
  },
  button: {
    width: "85%",
    backgroundColor: "#F2CBBB",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
