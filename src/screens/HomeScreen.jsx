import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import logoImage from "../../assets/adaptive-icon.png";

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.headerText}>Bienvenido a Lost & Found</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>¿Qué es Lost & Found?</Text>
        <Text style={styles.infoDescription}>
          Somos una comunidad que conecta mascotas perdidas con sus dueños, sin
          importar dónde estén. Los dueños reportan animales extraviados y
          quienes encuentran uno pueden avisar a la comunidad, ayudando a que
          vuelvan a casa. Creemos en la colaboración para cuidar a nuestros
          amigos peludos.
        </Text>
        <Text style={styles.infoDescription}>
          En el mapa encontrarás indicadores de mascotas perdidas y encontradas.
          Podrás subir fotos y añadir detalles para facilitar el reencuentro.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate("Mapa")}
      >
        <Text style={styles.exploreButtonText}>¡Empezar a Explorar!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e7e6e0",
    alignItems: "center",
    paddingBottom: 30,
  },
  header: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#faf9f3",
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D96C3F", 
    marginBottom: 15,
    textAlign: "center",
  },
  infoDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  exploreButton: {
    backgroundColor: "#d8693f", 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
