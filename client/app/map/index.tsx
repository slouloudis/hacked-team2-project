import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import AddHazardForm from "@/components/HazardForm"; // Form to add new hazard-based report
import { Link } from "expo-router";

export default function ReportMap({ navigation }: any) {
  const [location, setLocation] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  // console.log(reports)
// 
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/reports");
        const data = await res.json();
        setReports(data); // rename from 'hazards' to 'reports'
      } catch (err) {
        console.log("Error fetching reports:", err);
      }
    })();
  }, []);

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

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewCoordinates({ latitude, longitude });
    setModalVisible(true);
  };

  const handleReportPress = (report: any) => {
    if (!location) return;
    setRoute([
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: report.latitude, longitude: report.longitude },
    ]);
  };


  const onFormSuccess = (newReport: any) => {
    setReports((prev) => [...prev, newReport]); 
    setModalVisible(false);
    setNewCoordinates(null);
  };

  if (!location) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Link to /home using Expo Router */}
        <Link href={"/home"}>home</Link>
        <Text style={styles.headerTitle}>Reports Map</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          onPress={handleMapPress}
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              title={report.type}
              description="Tap to navigate"
              onPress={() => handleReportPress(report)}
            />
          ))}
          {route && <Polyline coordinates={route} strokeWidth={4} strokeColor="red" />}
        </MapView>
      </View>

      {/* Smaller modal for the form */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <AddHazardForm
              coordinates={newCoordinates}
              onClose={() => {
                setModalVisible(false);
                setNewCoordinates(null);
              }}
              onSuccess={onFormSuccess}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%", // so the form won't fill the entire screen
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
});
