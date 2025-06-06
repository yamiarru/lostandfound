import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/fb";
import NotFoundImage from "../../assets/notfound.png"; 

// Abstracción de colores por estado
const statusColors = {
  perdido: {
    background: "#E6F0FF",
    border: "#007FFF",
    text: "#007FFF",
    label: "Perdido",
  },
  encontrado: {
    background: "#F0E6FF",
    border: "#A040FB",
    text: "#A040FB",
    label: "Encontrado",
  },
  resuelto: {
    background: "#E6FFE6",
    border: "#32A852",
    text: "#32A852",
    label: "Resuelto",
  },
};

const MyPetsScreen = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canAddPet, setCanAddPet] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMyPets = async () => {
      if (!currentUser?.uid) return;

      try {
        const q = query(
          collection(db, "pets"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const myPets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(myPets);

        // Verificar cuántas mascotas activas tiene el usuario
        const activePets = myPets.filter(
          (pet) => pet.status === "perdido" || pet.status === "encontrado"
        );
        setCanAddPet(activePets.length < 2);
      } catch (error) {
        console.error("Error al cargar tus mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPets();
  }, [currentUser]);

  const renderItem = ({ item }) => {
    const colors = statusColors[item.status] || {
      background: "#EEE",
      border: "#888",
      text: "#333",
      label: item.status,
    };

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderLeftColor: colors.border,
          },
        ]}
        onPress={() => navigation.navigate("PetDetail", { pet: item })}
      >
        <Image source={{ uri: item.image?.uri }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={[styles.status, { color: colors.text }]}>
            {colors.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
          Cargando tus publicaciones...
        </Text>
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.loader}>
        <Image
          source={NotFoundImage}
          style={{ width: 180, height: 180, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 16, color: "#777", marginBottom: 16 }}>
          No has publicado mascotas aún.
        </Text>
        <TouchableOpacity
          style={[styles.addButton, !canAddPet && styles.disabledButton]}
          onPress={() => navigation.navigate("AddPet")}
          disabled={!canAddPet}
        >
          <Text style={styles.addButtonText}>
            {canAddPet ? "Publicar mascota" : "Límite alcanzado"}
          </Text>
        </TouchableOpacity>
        {!canAddPet && (
          <Text style={styles.infoText}>
            Solo puedes tener 2 mascotas activas a la vez (perdidas o
            encontradas).
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={{ padding: 16, alignItems: "center" }}>
        <TouchableOpacity
          style={[styles.addButton, !canAddPet && styles.disabledButton]}
          onPress={() => navigation.navigate("AddPet")}
          disabled={!canAddPet}
        >
          <Text style={styles.addButtonText}>
            {canAddPet ? "Publicar nueva mascota" : "Límite alcanzado"}
          </Text>
        </TouchableOpacity>
        {!canAddPet && (
          <Text style={styles.infoText}>
            Solo puedes tener 2 mascotas activas a la vez (perdidas o
            encontradas).
          </Text>
        )}
      </View>
    </View>
  );
};

export default MyPetsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    justifyContent: "center",
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  type: {
    fontSize: 13,
    color: "#555",
  },
  status: {
    marginTop: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#8DA290",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoText: {
    marginTop: 12,
    marginBottom: 32,
    fontSize: 14,
    color: "#D9534F",
    textAlign: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FCEAEA",
    borderRadius: 8,
    paddingVertical: 8,
    fontWeight: "500",
  },
});
