import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Gamepad2, TrendingUp } from 'lucide-react-native';

export const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to PlayStation Family</Text>
      </View>

      <View style={styles.card}>
        <Gamepad2 size={40} color="#0070F3" />
        <Text style={styles.cardTitle}>Current Game</Text>
        <Text style={styles.cardText}>God of War Ragnarök</Text>
      </View>

      <View style={styles.card}>
        <TrendingUp size={40} color="#0070F3" />
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <Text style={styles.cardText}>Earned 5 trophies today</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends Online</Text>
        <Text style={styles.sectionText}>3 friends are currently online</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#0070F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
  },
});
