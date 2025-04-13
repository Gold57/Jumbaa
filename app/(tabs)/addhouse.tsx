import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, ScrollView } from "react-native";
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function AddHouseForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddHouse = async () => {
    if (!imageUrl.trim()) {
      alert("Please enter an image URL.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "houses"), {
        name: name,
        location: location,
        price: parseFloat(price),
        imageUrl: imageUrl.trim(),
      });

      setName("");
      setLocation("");
      setPrice("");
      setImageUrl("");
      setLoading(false);
      alert("House added successfully!");
    } catch (error) {
      console.error("Error adding house: ", error);
      setLoading(false);
      alert("Failed to add house.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
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
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
        ) : null}

        <Button
          title={loading ? "Adding..." : "Add House"}
          onPress={handleAddHouse}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#E0F0FF", // Bluish card background
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#003366",
    textAlign: "center",
  },
  input: {
    height: 44,
    backgroundColor: "white",
    borderColor: "#87CEFA",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
});
