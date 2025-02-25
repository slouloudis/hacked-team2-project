import { Button, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function Page() {
  // todo query to get the hazard list and their default descriptions.
  const [formValues, setFormValues] = useState({
    hazard: "",
    severity: "",
    description: "",
    time_start: "",
    latitude: "",
    longitude: "",
    estimated_duration: "Unknown",
    is_planned: true,
  });

  function handleChange(field: string, value: any) {
    if (field === "hazard") {
      // todo On hazard change (picked from drop down) replace discription with it's default.
    }
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log(formValues);
  }

  function getCurrentTime() {
    const currentTime = new Date().toISOString();
    handleChange("time_start", currentTime);
  }

  function handleSubmit() {
    console.log("User has submitted the form");
    console.log(formValues);
    fetch("http://localhost:8080/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hazard: formValues.hazard,
        description: formValues.description,
        latitude: formValues.latitude,
        longitude: formValues.longitude,
        time_start: formValues.time_start,
        estimated_duration: formValues.estimated_duration,
        severity: formValues.severity,
        is_planned: formValues.is_planned,
      }),
    });
  }
  return (
    <View>
      {/* I plan to validate table on submit */}
      {/* We can add a ? to each field which can be tapped to give extra information, helping guide users through the form */}
      <Text>What is the hazard</Text>
      {/* todo: When end point is ready populate a drop down menu with list of hazards instead of having them type it in. */}
      <TextInput value={formValues.hazard} onChangeText={(value) => handleChange("hazard", value)}></TextInput>
      {formValues.hazard ? (
        <>
          <Text>Provide a description for the hazard.</Text>
          <TextInput
            value={formValues.description}
            onChangeText={(value) => handleChange("description", value)}
          ></TextInput>
        </>
      ) : null}
      <Text>Time of occurance.</Text>
      <Button title="Current Time" onPress={getCurrentTime}></Button>
      <TextInput
        placeholder="Enter time start"
        value={formValues.time_start}
        onChangeText={(value) => handleChange("time_start", value)}
      />
      {/* TODO: Input for time, likely date picker + input to enter time, code to format entry to be sent into database, and a button to select current time. */}
      <Text>Where is the latitude of the hazard?</Text>
      {/* TODO/Stretch goal: add a button that takes the user's current location using GPS and fills the form in */}
      <TextInput
        keyboardType="numeric"
        value={formValues.latitude}
        onChangeText={(value) => handleChange("latitude", value)}
      ></TextInput>
      <Text>Where is the longitide of the hazard?</Text>
      <TextInput
        keyboardType="numeric"
        value={formValues.longitude}
        onChangeText={(value) => handleChange("longitude", value)}
      ></TextInput>
      <Text>Provide a description for the hazard.</Text>
      <Text>How severe is this hazard?</Text>
      <Picker selectedValue={formValues.severity} onValueChange={(value) => handleChange("severity", value)}>
        {/* TODO: Check that low/mid/high string matches the restraints exactly in the database. */}
        <Picker.Item label="Low risk." value="low" />
        <Picker.Item label="Medium risk" value="medium" />
        <Picker.Item label="high risk" value="high" />
      </Picker>
      <Text>What is the estimated duration for this hazard</Text>
      <TextInput
        value={formValues.estimated_duration}
        onChangeText={(value) => handleChange("estimated_duration", value)}
        placeholder="Unknown"
      ></TextInput>
      <Text>Is this something that has been planned (eg construction work):</Text>
      {/* Currently bugged as planned becomes false while unplanned becomes true */}
      <Picker selectedValue={formValues.is_planned} onValueChange={(value) => handleChange("is_planned", value)}>
        <Picker.Item label="Planned" value={true} />
        <Picker.Item label="Unplanned" value={false} />
      </Picker>
      <Button title="Submit" onPress={handleSubmit}></Button>
    </View>
  );
}
