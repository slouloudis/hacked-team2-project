import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Hazard {
  id: number;
  name: string;
  default_description?: string;
}

interface FormValues {
  hazard: string; 
  severity: string;
  description: string;
  time_start: string; // store ISO string
  latitude: string;
  longitude: string;
  estimated_duration: string;
  is_planned: string; 
}

export default function AddHazardForm({
  coordinates,
  onSuccess,
  onClose,
}: {
  coordinates: { latitude: number; longitude: number } | null;
  onSuccess: (newHazard: any) => void;
  onClose: () => void;
}) {
  const [hazardList, setHazardList] = useState<Hazard[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({
    hazard: "",
    severity: "low",
    description: "",
    time_start: "",
    latitude: "",
    longitude: "",
    estimated_duration: "Unknown",
    is_planned: "true",
  });

  // for the native time picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [chosenTime, setChosenTime] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:3000/hazards")
      .then((res) => res.json())
      .then((data) => setHazardList(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (coordinates) {
      setFormValues((prev) => ({
        ...prev,
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
      }));
    }
  }, [coordinates]);

  function handleChange(field: keyof FormValues, value: string) {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Called when user sets the time in the native time picker
  function onTimePickerChange(event: any, selectedDate?: Date) {
    setShowTimePicker(false);
    if (selectedDate) {
      setChosenTime(selectedDate);
      handleChange("time_start", selectedDate.toISOString());
    }
  }

  async function handleSubmit() {
    try {
      const hazardId = getHazardId(formValues.hazard);
      console.log("Hazard ID:", hazardId);

      const response = await fetch("http://localhost:3000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hazard_id: hazardId,
          description: formValues.description,
          latitude: parseFloat(formValues.latitude),
          longitude: parseFloat(formValues.longitude),
          time_start: formValues.time_start,
          estimated_duration: formValues.estimated_duration,
          severity: formValues.severity,
          is_planned: formValues.is_planned === "true",
        }),
      });
      const newReport = await response.json();
      onSuccess({
        id: newReport.id,
        latitude: parseFloat(formValues.latitude),
        longitude: parseFloat(formValues.longitude),
        type:
          hazardList.find((h) => h.id.toString() === formValues.hazard)?.name ||
          "New Hazard",
      });
    } catch (err) {
      console.log("Error submitting form:", err);
    }
  }

  return (
    <ScrollView style={{ flexGrow: 0 }}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Select Hazard Type:</Text>
        <Picker
          selectedValue={formValues.hazard}
          onValueChange={(val) => handleChange("hazard", val)}
          style={styles.picker}
        >
          <Picker.Item label="Fallen Tree" value="Fallen Tree" />
          <Picker.Item label="Icy roads" value="Icy roads" />
          <Picker.Item label="Flooded Roads" value="Flooded Roads" />
          <Picker.Item label="Potholes" value="Potholes" />
          <Picker.Item label="Fog" value="Fog" />
          <Picker.Item label="Oil Spills" value="Oil Spills" />
          <Picker.Item label="Roadworks" value="Roadworks" />
          <Picker.Item label="Black Ice" value="Black Ice" />
          <Picker.Item label="Deer Crossing" value="Deer Crossing" />
          <Picker.Item label="Landslides" value="Landslides" />
          <Picker.Item label="Falling Rocks" value="Falling Rocks" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        {formValues.hazard !== "" && (
            <>
            <Text style={styles.label}>Description (optional override):</Text>
            <TextInput
              style={styles.input}
              value={formValues.description}
              onChangeText={(val) => handleChange("description", val)}
              placeholder={
              formValues.hazard === "Fallen Tree"
                ? "A tree has fallen over on a pathway, causing disruption for pedestrians hoping to cross the footpath."
                : formValues.hazard === "Icy roads"
                ? "Due to snowfall the roads have become icy, causing risk of vehicles of losing control causing an accident`"
                : formValues.hazard === "Flooded Roads"
                ? "Heavy rainfall has caused roads to be submerged, posing a risk of vehicles stalling and being swept away"
                : formValues.hazard === "Potholes"
                ? "Large potholes on the road surface can damage vehicles and cause accidents"
                : formValues.hazard === "Fog"
                ? "Thick fog reduces visibility, making it difficult for drivers to see the road and other vehicles"
                : formValues.hazard === "Oil Spills"
                ? "Spillage of oil on the road can make it slippery and cause vehicles to lose control"
                : formValues.hazard === "Roadworks"
                ? "Ongoing construction work on the road can cause delays and pose a risk of accidents due to obstacles"
                : formValues.hazard === "Black Ice"
                ? "Invisible ice on the road surface can cause vehicles to skid and lose control, especially during winter"
                : formValues.hazard === "Deer Crossing"
                ? "Areas where deer frequently cross the road can lead to sudden stops and collisions with the animals"
                : formValues.hazard === "Landslides"
                ? "Sudden landslides can block roads and pose a significant danger to vehicles"
                : formValues.hazard === "Falling Rocks"
                ? "Areas prone to falling rocks from cliffs or mountainsides can damage vehicles and cause accidents"
                : formValues.hazard === "Other"
                ? "Please enter a description of the hazard" : "Please enter a description of the hazard"
              }
            />
            </>
        )}

        <Text style={styles.label}>Time of occurrence</Text>
        {/* Button to open the time picker */}
        <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
        {/* Show the chosen time in your UI if you like */}
        {formValues.time_start ? (
          <Text style={styles.timePreview}>
            {new Date(formValues.time_start).toLocaleTimeString().split(':02').join('')}
          </Text>
        ) : null}

        {/* The actual native time picker */}
        {showTimePicker && (
          <DateTimePicker
            value={chosenTime}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimePickerChange}
          />
        )}

        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formValues.latitude}
          onChangeText={(val) => handleChange("latitude", val)}
        />

        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formValues.longitude}
          onChangeText={(val) => handleChange("longitude", val)}
        />

        <Text style={styles.label}>How severe is this hazard?</Text>
        <Picker
          selectedValue={formValues.severity}
          onValueChange={(val) => handleChange("severity", val)}
          style={styles.picker}
        >
          <Picker.Item label="Low risk" value="low" />
          <Picker.Item label="Medium risk" value="medium" />
          <Picker.Item label="High risk" value="high" />
        </Picker>

        <Text style={styles.label}>Estimated duration</Text>
        <TextInput
          style={styles.input}
          value={formValues.estimated_duration}
          onChangeText={(val) => handleChange("estimated_duration", val)}
          placeholder="Unknown"
        />

        <Text style={styles.label}>Is this planned?</Text>
        <Picker
          selectedValue={formValues.is_planned}
          onValueChange={(val) => handleChange("is_planned", val)}
          style={styles.picker}
        >
          <Picker.Item label="Planned" value="true" />
          <Picker.Item label="Unplanned" value="false" />
        </Picker>

        <View style={styles.buttonRow}>
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" color="red" onPress={onClose} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  timePreview: {
    marginVertical: 5,
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

function getHazardId(hazard: string) {
 if (hazard === "Fallen Tree") {
    return 1;
  } else if (hazard === "Icy roads") {  
    return 2;
  } else if (hazard === "Flooded Roads") {
    return 5;
  } else if (hazard === "Potholes") {
    return 6;
  }
  else if (hazard === "Fog") {
    return 7;
  }
  else if (hazard === "Oil Spills") {
    return 8;
  }
  else if (hazard === "Roadworks") {
    return 9;
  }
  else if (hazard === "Black Ice") {
    return 10;
  }
  else if (hazard === "Deer Crossing") {
    return 11;
  }
  else if (hazard === "Landslides") {
    return 12;
  }
  else if (hazard === "Falling Rocks") {
    return 13;
  }
  else{
    return 14;
  }
}
