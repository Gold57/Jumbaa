import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput } from "react-native";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Ionicons } from '@expo/vector-icons';

interface House {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [houses, setHouses] = useState<House[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchHouses = async () => {
      const querySnapshot = await getDocs(collection(db, "houses"));
      const houseList: House[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as DocumentData),
      })) as House[];
      setHouses(houseList);
    };

    fetchHouses();
  }, []);

  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jumbaa</Text>

      {/* Search input */}
      <View style={styles.searchContainer}>
  <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search house"
    placeholderTextColor="#888"
    value={searchText}
    onChangeText={setSearchText}
  />
</View>

      {/* House list */}
      <FlatList
        data={filteredHouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.houseImage} />
            )}
            <Text style={styles.houseText}>🏠 Name: {item.name}</Text>
            <Text style={styles.houseText}>📍 Location: {item.location}</Text>
            <Text style={styles.houseText}>💰 Price: ${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff", // Always white background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#e6f0ff", // Blue-ish background
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#cce0ff",
  },
  houseText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#003366",
  },
  houseImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
  },
  
});
