import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { hazards } from "./HazardStore";

interface Hazard {
  id: number;
  name: string;
  default_description?: string;
}

interface FormValues {
  hazard: string; // hazard_id
  severity: string;
  description: string;
  time_start: string; // store ISO string
  latitude: string;
  longitude: string;
  estimated_duration: string;
  is_planned: string; // "true" or "false" from the picker
}

export default function AddHazardForm({
  coordinates,
  onSuccess,
  onClose,
}: {
  coordinates: { latitude: number; longitude: number } | null;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [hazardList] = useState<Hazard[]>(hazards);
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [chosenTime, setChosenTime] = useState(new Date());

  // Pre-fill latitude/longitude from map press
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
    setFormValues((prev) => ({ ...prev, [field]: value }));
    console.log(formValues)
  }

  function onTimePickerChange(event: any, selectedDate?: Date) {
    setShowTimePicker(false);
    if (selectedDate) {
      setChosenTime(selectedDate);
      // Convert to ISO format so it matches the server’s example
      handleChange("time_start", selectedDate.toISOString());
    }
  }

  async function handleSubmit() {
    try {
      // Construct a request body that exactly matches your Postman data
      const requestBody = {
        user_id: 1, // Example hard-coded user_id
        hazard_id: parseInt(formValues.hazard, 10),
        description: formValues.description,
        time_start: formValues.time_start,
        latitude: parseFloat(formValues.latitude),
        longitude: parseFloat(formValues.longitude),
        estimated_duration: formValues.estimated_duration,
        is_planned: formValues.is_planned === "true",
        severity: formValues.severity,
      };

      console.log("Submitting request body:", requestBody);

      const response = await fetch("https://hacked-team2-project.onrender.com/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Server error:", errorText);
        return;
      }

      const newReport = await response.json();
      console.log("Created new report:", newReport);

      // Let the parent know submission worked, so it can re-fetch, etc.
      onSuccess();
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
            <Text style={styles.label}>Description (optional):</Text>
            <TextInput
              style={styles.input}
              value={formValues.description}
              onChangeText={(val) => handleChange("description", val)}
              placeholder="Enter a description"
            />
          </>
        )}

        <Text style={styles.label}>Time of occurrence</Text>
        <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
        {formValues.time_start ? (
          <Text style={styles.timePreview}>
            {new Date(formValues.time_start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        ) : null}

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

        <Text style={styles.label}>Severity</Text>
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
