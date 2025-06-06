import { requestForegroundPermissionsAsync } from "expo-location";
import { useState } from "react";

const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const getUserLocation = async () => {
    try {
      let { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permiso a la ubicación fue RECHAZADO");
        return false;
      }

      const getMockedCoords = async () => ({
        accuracy: 600,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: -34.610841,
        longitude: -58.563036,
        speed: 0,
      });

      const coords = await getMockedCoords();
      if (coords) {
        const { latitude, longitude } = coords;
        setLatitude(latitude);
        setLongitude(longitude);
        return true;
      }
    } catch (error) {
      setErrorMsg("Error obteniendo la ubicación");
      return false;
    }
  };

  return { getUserLocation, latitude, longitude, errorMsg };
};

export default useLocation;
