import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../config/fb";
import { useNavigation } from "@react-navigation/native";

const statusColors = {
  perdido: {
    background: "#F0F8FF",
    badge: "#E0F0FF",
    textColor: "#003366",
    label: "Perdido",
  },
  encontrado: {
    background: "#F8F0FF",
    badge: "#F2E6FF",
    textColor: "#4B0082",
    label: "Encontrado",
  },
  resuelto: {
    background: "#F2FFF0",
    badge: "#E0FFE6",
    textColor: "#006600",
    label: "Resuelto",
  },
};

const PetDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { pet } = route.params;
  const currentUser = auth.currentUser;
  const isOwner = currentUser && pet.userId === currentUser.uid;

  const colors = statusColors[pet.status] || statusColors.perdido;

  const openWhatsApp = () => {
    if (!currentUser) {
      Alert.alert(
        "Iniciar sesión requerido",
        "Necesitas estar logueado para contactarte por WhatsApp.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Iniciar sesión",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
      return;
    }

    const message = `Hola, vi tu publicación sobre ${pet.name}. ¿Sigue disponible la información?`;
    const url = `https://wa.me/${pet.phone.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pet.latitude},${pet.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Image source={pet.image} style={styles.image} />

        <Text style={styles.name}>{pet.name}</Text>

        <View
          style={[styles.badgeContainer, { backgroundColor: colors.badge }]}
        >
          <Text style={[styles.badgeText, { color: colors.textColor }]}>
            {pet.type} •{" "}
            <Text style={{ fontWeight: "bold" }}>{colors.label}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.description}>{pet.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Información adicional:</Text>
          <Text style={styles.infoText}>📍 Dirección: {pet.address}</Text>
          <Text style={styles.infoText}>📆 Fecha: {pet.date}</Text>
          <Text style={styles.infoText}>🐾 Raza: {pet.breed}</Text>
          <Text style={styles.infoText}>⚧️ Género: {pet.gender}</Text>
          <Text style={styles.infoText}>🎂 Edad: {pet.age}</Text>
          {pet.status === "encontrado" && pet.retained && (
            <Text style={styles.infoText}>
              🏠 Está retenido en un domicilio
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            {pet.status === "perdido"
              ? `Dueño/a: ${pet.owner}`
              : `Encontrado por: ${pet.owner}`}
          </Text>

          {/* Mostrar botón solo si el estado no es "resuelto" */}
          {pet.status !== "resuelto" && (
            <TouchableOpacity
              style={[styles.whatsappButton, !currentUser && { opacity: 0.8 }]}
              onPress={openWhatsApp}
            >
              <Ionicons
                name={currentUser ? "logo-whatsapp" : "lock-closed-outline"}
                size={24}
                color="#fff"
              />
              <Text style={styles.whatsappText}>
                {currentUser
                  ? "Enviar mensaje por WhatsApp"
                  : "Inicia sesión para contactar"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.mapContainer}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={openGoogleMaps}
            activeOpacity={0.9}
          >
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: pet.latitude,
                longitude: pet.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pointerEvents="none"
            >
              <Marker
                coordinate={{
                  latitude: pet.latitude,
                  longitude: pet.longitude,
                }}
              />
            </MapView>
          </TouchableOpacity>
        </View>

        {isOwner && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("AddPet", { pet, isEditing: true })
            }
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Editar publicación</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  badgeContainer: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 16,
  },
  section: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  whatsappText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  mapContainer: {
    marginTop: 20,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  editButton: {
    backgroundColor: "#6C63FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
