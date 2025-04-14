import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface House {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
}

export default function Home() {
  const [houses, setHouses] = useState<House[]>([]);
  const [searchText, setSearchText] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [showBedroomOptions, setShowBedroomOptions] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // You can use user.displayName or fallback to email
        setUserName(user.displayName || user.email || "User");
      } else {
        setUserName(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const filteredHouses = houses.filter((house) => {
    const matchesSearch = house.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesBedroom =
      bedroomFilter === null || house.bedrooms === bedroomFilter;
    return matchesSearch && matchesBedroom;
  });

  const bedroomOptions = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jumbaa</Text>
      <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile')}>
        <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
      </TouchableOpacity>
      {userName && (
  <Text style={styles.greetingText}>Hi, {userName} 👋</Text>
)}
      <Text style={styles.subtitle}>Find your dream house!</Text>
      

      {/* Search input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search house"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Bedroom Filter */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowBedroomOptions(!showBedroomOptions)}
      >
        <Text style={styles.filterButtonText}>
          {bedroomFilter ? `Bedrooms: ${bedroomFilter}` : "Filter by Bedrooms"}
        </Text>
        <Ionicons
          name={showBedroomOptions ? "chevron-up" : "chevron-down"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>

      {showBedroomOptions && (
        <View style={styles.filterOptionsContainer}>
          <ScrollView horizontal>
            {bedroomOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  bedroomFilter === option && styles.selectedOption,
                ]}
                onPress={() => {
                  setBedroomFilter(option === bedroomFilter ? null : option);
                  setShowBedroomOptions(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    bedroomFilter === option && styles.selectedOptionText,
                  ]}
                >
                  {option} Bedroom{option > 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* House list */}
      <FlatList
        data={filteredHouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "../housedetail",
                params: { house: JSON.stringify(item) },
              })
            }
          >
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.houseImage} />
            )}
            <Text style={styles.houseText}>🏠 Name: {item.name}</Text>
            <Text style={styles.houseText}>📍 Location: {item.location}</Text>
            <Text style={styles.houseText}>💰 Price: ${item.price}</Text>
            <Text style={styles.houseText}>🛏️ Bedrooms: {item.bedrooms}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  subtitle:{
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    fontWeight: "semibold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#e6f0ff",
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
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    paddingHorizontal: 15, 
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
  filterButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f4f7",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#333",
  },
  filterOptionsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  selectedOption: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  optionText: {
    color: "#333",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "#fff",
  },
  profileCard: {
    width: 60,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    marginRight: 12,
    marginTop: 10,
    marginBottom:10,
  },
  greetingText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
  
});
