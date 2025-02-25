import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, Modal, TextInput } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const HazardMap = () => {
  const [location, setLocation] = useState(null);
  const [hazards, setHazards] = useState<any>([
        { id: 1, latitude: 52.6309, longitude: 1.2974, type: "Fallen Tree" },
        { id: 2, latitude: 52.6315, longitude: 1.2988, type: "Icy Road" }
  ]);
  const [route, setRoute] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHazard, setNewHazard] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hazardType, setHazardType] = useState("");

  console.log(hazards)
  useEffect(() => {
    (async () => {
        const res = await fetch(`http://localhost:3000/get-reports`)
        const data = await res.json()
        setHazards(data)
    })
  }, [])

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewHazard({ latitude, longitude });
    setModalVisible(true);
  };


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to view the map.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleHazardPress = (hazard:any) => {
    if (!location) return;
    
    setRoute([
      { latitude: location.latitude, longitude: location.longitude }, 
      { latitude: hazard.latitude, longitude: hazard.longitude }
    ]);
  };

  const addHazard = () => {
    if (!hazardType.trim()) {
      Alert.alert("Please enter a hazard type.");
      return;
    }

    setHazards((prev: any) => [
      ...prev,
      { id: prev.length + 1, latitude: newHazard!.latitude, longitude: newHazard!.longitude, type: hazardType }
    ]);

    setModalVisible(false);
    setNewHazard(null);
    setHazardType("");
  };

  if (!location) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <>
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01}}
          showsUserLocation
          onPress={handleMapPress}
      >
        {/* Hazard Markers */}
        {hazards.map((hazard : any) => (
          <Marker
            key={hazard.id}
            coordinate={{ latitude: hazard.latitude, longitude: hazard.longitude }}
            title={hazard.type}
            description="Tap to navigate"
            onPress={() => handleHazardPress(hazard)}
          />
        ))}

        {/* Route from user to hazard */}
        {route && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor="red"
          />
        )}
      </MapView>
    </View>
    <Modal visible={modalVisible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Enter Hazard Type:</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Flooded Road"
          value={hazardType}
          onChangeText={setHazardType}
        />
        <Button title="Add Hazard" onPress={addHazard} />
        <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
      </View>
    </View>
  </Modal>
  </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "gray", padding: 8, marginBottom: 10, width: "100%" },
});

export default HazardMap;
