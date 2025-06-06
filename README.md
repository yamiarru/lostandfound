# 🐾 Lost&Found - App de mascotas perdidas

**Lost&Found** es una aplicación móvil construida con **React Native**, cuyo objetivo es ayudar a encontrar perros perdidos y reportar aquellos que han sido encontrados. Los usuarios pueden subir una foto del animal y marcar en el mapa el lugar donde se perdió o fue encontrado.

---

## 🚀 Funcionalidades principales

- 📍 **Geolocalización en tiempo real**: muestra un mapa con la ubicación actual del usuario.✅
- 📸 **Carga de imagen**: permite subir una foto del perro perdido o encontrado.
- 🗺️ **Marcas en el mapa**:
  - Reportar perro perdido: se indica la zona donde fue visto por última vez.
  - Reportar perro encontrado: se indica el lugar donde fue hallado.
- 👥 **Perfil de usuario**: cada usuario puede ver sus publicaciones y seguir otras.
- 🐶 **Seguimiento de casos**: ver si una publicación ya fue resuelta.

---

## 📱 Tecnologías utilizadas

- React Native (Expo) SDK 53
- Expo Location
- MapView (react-native-maps)
- Expo ImagePicker
- React Navigation
- Firebase (Auth, Firestore y Storage)

---

## 📱 Recursos

- expo-location [video](https://www.youtube.com/watch?v=ltHbdeJg9eA) (para obtener coordenadas de la ubicación)
- react-native-maps (para visualizar graficamente la ubicación)
- expo-image-picker
- expo-camera (para utilizar la camara)
- expo-media-library (para guardar la foto en el dispositivo)
- @expo/vector-icons - https://icons.expo.fyi/Index (ya viene por default en el SDK)
- expo-router [info](https://medium.com/@abdulaleemzafar515/the-benefits-of-using-expo-router-over-react-navigation-172f21772152)
- react-native-safe-area-context
- react-native-screens
- expo-linking
- expo-constants
- expo-status-bar

---

## 🎨 Paleta visual 
- Fondo general: #FCF1D8 // #fbfaf4
- Header: #DEE2D9
- Botones / elementos activos: #F2CBBB // #d8693f
- Texto: #000000 
- Especiales: #8DA290

---

## 🛠️ Instalación y ejecución

1. cd lostandfound
2. npm i
3. npx expo start
4. Utilizo el simulador Pixel 5, Android 14, Google Apis
