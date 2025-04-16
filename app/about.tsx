import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function AboutPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Jumbaa</Text>
      <Text style={styles.paragraph}>
        Jumbaa is your go-to app for finding rental houses with ease. Our mission is to connect tenants and landlords by offering a smooth and smart house-hunting experience.
      </Text>

      <Text style={styles.sectionTitle}>🌟 Features</Text>
      <View style={styles.card}>
        <Text style={styles.listItem}>• Browse rental listings with images</Text>
        <Text style={styles.listItem}>• Save favorite houses</Text>
        <Text style={styles.listItem}>• Contact landlords directly</Text>
        <Text style={styles.listItem}>• Real-time updates</Text>
      </View>

      <Text style={styles.sectionTitle}>📞 Need Help?</Text>
      <View style={styles.card}>
        <Text style={styles.paragraph}>
          Reach out to us anytime!
        </Text>
        <Text style={styles.contact}>📧 Email: support@jumbaaapp.com</Text>
        <Text style={styles.contact}>📞 Phone: +254-74-345678</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#003366",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
    color: "#003366",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: "#444",
    paddingVertical: 4,
  },
  contact: {
    fontSize: 16,
    color: "#005c99",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
});
