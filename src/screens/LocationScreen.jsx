import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import useLocation from "../hooks/useLocation";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/fb";
import { MaterialIcons } from "@expo/vector-icons";

const STATUS_COLORS = {
  perdido: {
    main: "#007FFF",
    background: "#E6F0FF",
    border: "#007FFF",
    text: "#007FFF",
  },
  encontrado: {
    main: "#A040FB",
    background: "#F0E6FF",
    border: "#A040FB",
    text: "#A040FB",
  },
  resuelto: {
    main: "#00C851",
    background: "#E6F9EF",
    border: "#00C851",
    text: "#00C851",
  },
  todos: {
    main: "#d8693f",
  },
  misMascotas: {
    main: "#FF9500",
  },
};

const PET_TYPE_ICONS = {
  Perro: "🐶",
  Gato: "🐱",
  Ave: "🕊️",
  Conejo: "🐰",
  Tortuga: "🐢",
  Otro: "🐾",
};

const LocationScreen = () => {
  const { getUserLocation, latitude, longitude } = useLocation();
  const currentUser = auth.currentUser;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [pets, setPets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [onlyMyPets, setOnlyMyPets] = useState(false);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const calloutAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        let petsQuery = collection(db, "pets");
        const conditions = [];

        if (filterStatus !== "todos") {
          conditions.push(where("status", "==", filterStatus));
        }

        if (onlyMyPets && currentUser?.uid) {
          conditions.push(where("userId", "==", currentUser.uid));
        }

        if (conditions.length > 0) {
          petsQuery = query(petsQuery, ...conditions);
        }

        const snapshot = await getDocs(petsQuery);
        const petsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPets(petsData);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };

    fetchPets();
  }, [filterStatus, onlyMyPets, currentUser]);

  useEffect(() => {
    const fetchLocation = async () => {
      const success = await getUserLocation();
      if (success && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 100,
            longitudeDelta: 100,
          },
          500
        );

        setTimeout(() => {
          mapRef.current.animateToRegion(
            {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            },
            1500
          );
          setIsLoading(false);
        }, 1600);
      } else {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [latitude, longitude]);

  useEffect(() => {
    if (selectedCoord) {
      Animated.timing(calloutAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedCoord]);

  const closeCallout = () => {
    Animated.timing(calloutAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSelectedCoord(null);
    });
  };

  const FilterButton = ({ label, value, icon }) => {
    const isActive = filterStatus === value;
    const color = STATUS_COLORS[value]?.main || "#007AFF";

    return (
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: isActive ? color : "#fff",
            borderColor: color,
          },
        ]}
        onPress={() => {
          setFilterStatus(value);
          setOnlyMyPets(false); 
        }}
      >
        <MaterialIcons
          name={icon}
          size={18}
          color={isActive ? "#fff" : color}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: isActive ? "#fff" : color,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const MyPetsButton = () => {
    if (!currentUser) return null;
    const color = STATUS_COLORS.misMascotas.main;

    return (
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: onlyMyPets ? color : "#fff",
            borderColor: color,
          },
        ]}
        onPress={() => {
          setOnlyMyPets(!onlyMyPets);
          if (!onlyMyPets) {
            setFilterStatus("todos");
          }
        }}
      >
        <MaterialIcons
          name="person"
          size={18}
          color={onlyMyPets ? "#fff" : color}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: onlyMyPets ? "#fff" : color,
          }}
        >
          Mis mascotas
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10, fontSize: 16, color: "#555" }}>
            Obteniendo tu ubicación...
          </Text>
        </View>
      ) : (
        <>
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 100,
              longitudeDelta: 100,
            }}
          >
            {latitude &&
              longitude &&
              pets.map((coord) => {
                const statusColor =
                  STATUS_COLORS[coord.status]?.main || "#007AFF";
                const icon =
                  PET_TYPE_ICONS[coord.type] || PET_TYPE_ICONS["Otro"];
                return (
                  <Marker
                    key={coord.id}
                    coordinate={{
                      latitude: coord.latitude,
                      longitude: coord.longitude,
                    }}
                    onPress={() => setSelectedCoord(coord)}
                  >
                    <View
                      style={[
                        styles.markerWrapper,
                        { borderColor: statusColor },
                      ]}
                    >
                      <Text style={styles.markerIcon}>{icon}</Text>
                    </View>
                  </Marker>
                );
              })}
          </MapView>

          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FilterButton label="Todos" value="todos" icon="pets" />
              <FilterButton label="Perdidos" value="perdido" icon="search" />
              <FilterButton
                label="Encontrados"
                value="encontrado"
                icon="check"
              />
              <FilterButton
                label="Resueltos"
                value="resuelto"
                icon="check-circle"
              />

              <MyPetsButton />
            </ScrollView>
          </View>

          {selectedCoord && (
            <Animated.View
              style={[
                styles.customCallout,
                {
                  backgroundColor:
                    STATUS_COLORS[selectedCoord.status]?.background ||
                    "#E6F0FF",
                  borderLeftColor:
                    STATUS_COLORS[selectedCoord.status]?.border || "#007FFF",
                  opacity: calloutAnim,
                  transform: [
                    {
                      translateY: calloutAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{ flexDirection: "row", flex: 1 }}
                onPress={() => {
                  navigation.navigate("PetDetail", { pet: selectedCoord });
                }}
              >
                <Image
                  source={{ uri: selectedCoord.image?.uri }}
                  style={styles.calloutImage}
                />
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutName}>{selectedCoord.name}</Text>
                  <Text style={styles.calloutType}>{selectedCoord.type}</Text>
                  <Text
                    style={[
                      styles.calloutStatus,
                      {
                        color:
                          STATUS_COLORS[selectedCoord.status]?.text ||
                          "#007FFF",
                      },
                    ]}
                  >
                    {selectedCoord.status.charAt(0).toUpperCase() +
                      selectedCoord.status.slice(1)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  closeCallout();
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  markerWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  markerIcon: {
    fontSize: 22,
  },
  customCallout: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 6,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignItems: "center",
  },
  calloutImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  calloutTextContainer: { justifyContent: "center", flex: 1 },
  calloutName: { fontWeight: "bold", fontSize: 16 },
  calloutType: { fontSize: 13, color: "#555" },
  calloutStatus: { marginTop: 4, fontWeight: "600", fontSize: 13 },
  closeButton: { position: "absolute", top: 8, right: 10, padding: 6 },
  closeButtonText: { fontSize: 18, color: "#888" },
  filterContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
});
