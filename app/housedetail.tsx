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

      <View style={styles.infoBox}>
  <Text style={styles.infoItem}>📍 {parsedHouse.location}</Text>
  <Text style={styles.infoItem}>💰 ${parsedHouse.price}</Text>
  <Text style={styles.infoItem}>🛏️ {parsedHouse.bedrooms} Bedrooms</Text>
</View>


      <View style={styles.infoCard}>
  <Text style={styles.sectionTitle}>Description</Text>
  <Text style={styles.paragraph}>{parsedHouse.description}</Text>
</View>

<View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.paragraph}>📞 Phone: {parsedHouse.contact.phone}</Text>
      <Text style={styles.paragraph}>📧 Email: {parsedHouse.contact.email}</Text>
</View>
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
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a2e35",
    flex: 1,
    flexWrap: "wrap",
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    color: "#1a2e35",
  },
  paragraph: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 14,
  },
  additionalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e6f0fa", // light bluish
    padding: 12,
    borderRadius: 10,
    marginVertical: 16,
  },
  infoItem: {
    fontSize: 15,
    fontWeight: "500",
    color: "#003366", // deep blue for contrast
    flex: 1,
    textAlign: "center",
  },
  
});
