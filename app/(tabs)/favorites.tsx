import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

interface House {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<House[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const favRef = collection(db, "users", user.uid, "favorites");
        const favSnap = await getDocs(favRef);

        const favList: House[] = [];
        favSnap.forEach((doc) => favList.push(doc.data() as House));
        setFavorites(favList);
      }
    };

    fetchFavorites();
  }, []);

  const goToDetails = (house: House) => {
    router.push({
      pathname: "/housedetail",
      params: { house: JSON.stringify(house) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Houses</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToDetails(item)} style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text style={{ fontWeight: "bold" }}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
});
