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
      const response = await fetch("http://localhost:3000/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hazard_id: formValues.hazard,
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
          <Picker.Item label="-- Choose a hazard --" value="" />
          {hazardList.map((haz) => (
            <Picker.Item key={haz.id} label={haz.name} value={haz.id.toString()} />
          ))}
        </Picker>

        {formValues.hazard !== "" && (
          <>
            <Text style={styles.label}>Description (optional override):</Text>
            <TextInput
              style={styles.input}
              value={formValues.description}
              onChangeText={(val) => handleChange("description", val)}
              placeholder="Enter a description"
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
