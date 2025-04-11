// app/(tabs)/home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, useColorScheme  } from "react-native";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config"; // update this path based on your folder


// Define the type for a house object
interface House {
  id: string;
  name: string;
  location: string;
  price: number; // Or string, depending on your data type in Firebase
  // Add other properties as needed
}

export default function Home() {
  const [houses, setHouses] = useState<House[]>([]); // Explicitly define the type of houses
  const colorScheme = useColorScheme(); // Get current theme (light or dark)


  useEffect(() => {
    const fetchHouses = async () => {
      const querySnapshot = await getDocs(collection(db, "houses"));
      const houseList: House[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as DocumentData), // Type assertion for doc.data()
      })) as House[];
      setHouses(houseList);
    };

    fetchHouses();
  }, []);

  

  const isDarkMode = colorScheme === 'dark';


  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Available Houses</Text>
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            <Text style={[styles.houseText, isDarkMode && styles.darkText]}>
              Name: {item.name}
            </Text>
            <Text style={[styles.houseText, isDarkMode && styles.darkText]}>
              Location: {item.location}
            </Text>
            <Text style={[styles.houseText, isDarkMode && styles.darkText]}>
              Price: ${item.price}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  darkContainer: { backgroundColor: '#121212' }, // Dark mode background
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: 'black' },
  darkText: { color: 'white' }, // Dark mode text color
  card: { padding: 10, borderWidth: 1, marginVertical: 5, borderRadius: 6, backgroundColor: 'white' },
  darkCard: { backgroundColor: '#333' }, // Dark mode card background
  houseText: { color: 'black' }, // Default text color
});
