import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Help() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      {/* FAQs */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <View style={styles.card}>
        <Text style={styles.q}>❓ How do I favorite a house?</Text>
        <Text style={styles.a}>Tap the heart icon on any house listing to save it to your favorites.</Text>

        <Text style={styles.q}>❓ Can I contact the house owner?</Text>
        <Text style={styles.a}>Yes, you can find the contact details on the listing's detail page.</Text>
      </View>

      {/* Navigation Tips */}
      <Text style={styles.sectionTitle}>Navigation Tips</Text>
      <View style={styles.card}>
        <Text style={styles.a}>Use the bottom tabs to quickly access Home and Favorites</Text>
        <Text style={styles.a}>Tap the back arrow at the top to return to the previous screen.</Text>
      </View>

      {/* How to Use the App */}
      <Text style={styles.sectionTitle}>How to Use the App</Text>
      <View style={styles.card}>
        <Text style={styles.a}>🔍 Browse available houses on the Home screen.</Text>
        <Text style={styles.a}>❤️ Tap the heart icon to save houses to your favorites.</Text>
        <Text style={styles.a}>📄 Tap on a listing to view full details, images, and contact info.</Text>
        <Text style={styles.a}>👤 Use the Profile tab to update your details.</Text>
      </View>

      {/* Contact Info */}
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <View style={styles.card}>
        <Text style={styles.a}>📧 Email: support@jumbaa.com</Text>
        <Text style={styles.a}>📞 Phone: +254 700 000 000</Text>
        <Text style={styles.a}>⏰ Support Hours: Mon–Fri, 9 AM – 5 PM</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#007AFF",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  q: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 5,
  },
  a: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },
});
