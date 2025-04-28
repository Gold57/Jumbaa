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
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { Easing } from "react-native-reanimated";
import * as Location from "expo-location";

interface House {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [houses, setHouses] = useState<House[]>([]);
  const [searchText, setSearchText] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [showBedroomOptions, setShowBedroomOptions] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownHeight] = useState(new Animated.Value(0));
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [nearbyHouses, setNearbyHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
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
        setUserName(user.displayName || user.email || "User");
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLocationAndHouses = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required to show houses near you.");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location.coords);

        const querySnapshot = await getDocs(collection(db, "houses"));
        const houses: House[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.latitude && data.longitude) {
            houses.push({
              id: docSnap.id,
              ...data,
            } as House);
          }
        });

        // Filter nearby houses (within 10km radius)
        const filtered = houses.filter((house) => {
          const dist = getDistance(
            location.coords.latitude,
            location.coords.longitude,
            house.latitude,
            house.longitude
          );
          return dist <= 10; // 10 km radius
        });

        setNearbyHouses(filtered);
      } catch (error) {
        console.error("Error fetching houses or location:", error);
        Alert.alert("Error", "Failed to load houses.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndHouses();
  }, []);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loaderText}>Loading houses near you...</Text>
      </View>
    );
  }

  const filteredHouses = houses.filter((house) => {
    const matchesSearch = house.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesBedroom =
      bedroomFilter === null || house.bedrooms === bedroomFilter;
    return matchesSearch && matchesBedroom;
  });

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);

    Animated.timing(dropdownHeight, {
      toValue: showDropdown ? 0 : 100, // Adjust the value based on your menu height
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Handle successful logout, navigate to login screen, etc.
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const bedroomOptions = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>

      {/* Profile and Menu Row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setShowMenu(!showMenu)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={32} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Jumbaa</Text>

        <TouchableOpacity
          style={styles.profileCard}
          onPress={toggleDropdown}
        >
          <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Hamburger Menu Dropdown */}
      {showMenu && (
        <View style={[styles.dropdown, styles.menuDropdown]}>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              router.push("/about");
            }}
          >
            <Text style={styles.dropdownText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              router.push("/help");
            }}
          >
            <Text style={styles.dropdownText}>Help</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Animated Dropdown for Profile */}
      {showDropdown && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              height: dropdownHeight,
              overflow: "hidden", // Hide the menu when it's collapsed
            },
            styles.profileDropdown, // Added custom style for profile dropdown
          ]}
        >
          <TouchableOpacity onPress={() => { router.push("/profile"); setShowDropdown(false); }}>
            <Text style={styles.dropdownText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

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
      <FlatList
          data={filteredHouses}
  keyExtractor={(item) => item.id}
  ListHeaderComponent={
    <>
      <Text style={styles.heading}>Houses Near You</Text>
      {nearbyHouses.length === 0 ? (
        <Text style={styles.noHouses}>No houses found near your current location.</Text>
      ) : (
        <FlatList
          data={nearbyHouses}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, styles.horizontalCard]}
              onPress={() =>
                router.push({
                  pathname: "../housedetail",
                  params: { house: JSON.stringify(item) },
                })
              }
            >
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.nearbyImage}
                />
              )}
              <Text style={styles.houseText}>🏠 {item.name}</Text>
              <Text style={styles.houseText}>📍 {item.location}</Text>
              <Text style={styles.houseText}>💰 ${item.price}</Text>
              <Text style={styles.houseText}>🛏️ {item.bedrooms}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Text style={styles.heading}>All Houses</Text>
    </>
  }  
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
  subtitle: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    fontWeight: "600",
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
  menuButton: {
    position: "relative",
    marginRight: 10,
    marginTop: 10,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 3,
  },
  profileDropdown: {
    top: 80,  // Position the profile dropdown beneath the profile card
    right: 10,
  },
  menuDropdown: {
    top: 70,  // Position the menu dropdown beneath the hamburger icon
    left: 10,
  },
  dropdownText: {
    fontSize: 16,
    paddingVertical: 5,
    color: "#007AFF",
  },
  noHouses: {
    fontSize: 16,
    color: "#999",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002244",
  },
  location: {
    fontSize: 16,
    marginTop: 4,
  },
  details: {
    fontSize: 14,
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 16,
  },
  horizontalCard: {
    width: 250,
    marginRight: 10,
  },
  nearbyImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },

});
