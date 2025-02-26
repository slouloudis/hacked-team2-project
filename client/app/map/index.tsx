import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import AddHazardForm from "@/components/HazardForm";
import { Link } from "expo-router";

export default function ReportMap() {
  const [location, setLocation] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchReports() {
    try {
      const res = await fetch("https://hacked-team2-project.onrender.com/reports");
      if (!res.ok) {
        console.log("Failed to fetch reports:", await res.text());
        return;
      }
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.log("Error fetching reports:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
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

  function handleMapPress(event: any) {
    if (event.nativeEvent.action !== "marker-press") {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setNewCoordinates({ latitude, longitude });
      setModalVisible(true);
    }
  }

  function handleReportPress(report: any) {
    if (!location) return;
    setRoute([
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: report.latitude, longitude: report.longitude },
    ]);
  }

  async function handleFormSuccess() {
    await fetchReports();
    setModalVisible(false);
    setNewCoordinates(null);
  }

  if (!location) return <ActivityIndicator size="large" style={styles.loader} />;
  if (isLoading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Link href={"/"}>home</Link>
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
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude,
              }}
              title={report.description}
              description="Tap to navigate"
              onPress={() => handleReportPress(report)}
            />
          ))}
          {route && (
            <Polyline coordinates={route} strokeWidth={4} strokeColor="red" />
          )}
        </MapView>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <AddHazardForm
              coordinates={newCoordinates}
              onSuccess={handleFormSuccess}
              onClose={() => {
                setModalVisible(false);
                setNewCoordinates(null);
              }}
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
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
});
