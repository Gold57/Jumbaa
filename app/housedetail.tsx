import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { MaterialIcons } from '@expo/vector-icons';

interface House {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  description: string;
  contact: {
    phone: string;
    email: string;
  };
  images?: string[];
}

export default function HouseDetail() {
  const { house } = useLocalSearchParams();
  const parsedHouse: House = JSON.parse(house as string);
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if the house is already in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const favRef = doc(db, "users", user.uid, "favorites", parsedHouse.id);
        const favSnap = await getDoc(favRef);
        setIsFavorited(favSnap.exists());
      }
    };

    checkFavorite();
  }, []);

  const handleFavorite = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Not logged in", "You must be logged in to favorite a house.");
        return;
      }

      const favRef = doc(db, "users", user.uid, "favorites", parsedHouse.id);

      await setDoc(favRef, parsedHouse);
      setIsFavorited(true);
      Alert.alert("Favorited", "This house has been added to your favorites.");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert("Error", "Failed to add to favorites.");
    }
  };

  const handleUnfavorite = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Not logged in", "You must be logged in to unfavorite a house.");
        return;
      }

      const favRef = doc(db, "users", user.uid, "favorites", parsedHouse.id);

      await deleteDoc(favRef);
      setIsFavorited(false);
      Alert.alert("Removed", "This house has been removed from your favorites.");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      Alert.alert("Error", "Failed to remove from favorites.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: parsedHouse.imageUrl }} style={styles.mainImage} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{parsedHouse.name}</Text>
        <TouchableOpacity onPress={isFavorited ? handleUnfavorite : handleFavorite}>
          <MaterialIcons
            name={isFavorited ? "favorite" : "favorite-border"}
            size={28}
            color={isFavorited ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>📍 {parsedHouse.location}</Text>
      <Text style={styles.text}>💰 ${parsedHouse.price}</Text>
      <Text style={styles.text}>🛏️ Bedrooms: {parsedHouse.bedrooms}</Text>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.paragraph}>{parsedHouse.description}</Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.paragraph}>📞 Phone: {parsedHouse.contact.phone}</Text>
      <Text style={styles.paragraph}>📧 Email: {parsedHouse.contact.email}</Text>

      {parsedHouse.images && parsedHouse.images.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>More Images</Text>
          {parsedHouse.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.additionalImage} />
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003366",
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#003366",
  },
  paragraph: {
    fontSize: 15,
    color: "#444",
    marginBottom: 12,
  },
  additionalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
