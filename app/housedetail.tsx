import React from "react";
import { useLocalSearchParams } from "expo-router";
import {View,Text,Image,ScrollView,StyleSheet,} from "react-native";

interface House {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  description: string;
  contact: string;
  images?: string[];
}

export default function HouseDetail() {
  const { house } = useLocalSearchParams();
  const parsedHouse: House = JSON.parse(house as string);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: parsedHouse.imageUrl }}
        style={styles.mainImage}
      />

      <Text style={styles.title}>{parsedHouse.name}</Text>
      <Text style={styles.text}>📍 {parsedHouse.location}</Text>
      <Text style={styles.text}>💰 ${parsedHouse.price}</Text>
      <Text style={styles.text}>🛏️ Bedrooms: {parsedHouse.bedrooms}</Text>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.paragraph}>{parsedHouse.description}</Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.paragraph}>📞Phone: {parsedHouse.contact.phone}</Text>
      <Text style={styles.paragraph}>📧 Email: {parsedHouse.contact.email}</Text>

      {parsedHouse.images && parsedHouse.images.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>More Images</Text>
          {parsedHouse.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.additionalImage}
            />
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
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
