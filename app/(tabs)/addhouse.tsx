import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { db } from "@/firebase/config"; 
import { collection, addDoc } from "firebase/firestore";

export default function AddHouseForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const handleAddHouse = async () => {
    try {
      await addDoc(collection(db, "houses"), {
        name: name,
        location: location,
        price: parseFloat(price),
      });
      // Reset the form after adding the house
      setName("");
      setLocation("");
      setPrice("");
      alert("House added successfully!");
    } catch (error) {
      console.error("Error adding house: ", error);
      alert("Failed to add house.");
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Add a New House</Text>
      <TextInput
        style={styles.input}
        placeholder="House Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <Button title="Add House" onPress={handleAddHouse} />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: { padding: 16, backgroundColor: "white" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
});
