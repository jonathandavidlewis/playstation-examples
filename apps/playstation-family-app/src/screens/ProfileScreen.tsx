import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy, Star, Users } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export const ProfileScreen = () => {
  const { accountId } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PS</Text>
        </View>
        <Text style={styles.username}>GamerTag123</Text>
        <Text style={styles.accountId}>ID: {accountId?.substring(0, 8)}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Trophy size={30} color="#FFD700" />
          <Text style={styles.statValue}>1,543</Text>
          <Text style={styles.statLabel}>Trophies</Text>
        </View>

        <View style={styles.statCard}>
          <Star size={30} color="#0070F3" />
          <Text style={styles.statValue}>Level 25</Text>
          <Text style={styles.statLabel}>PSN Level</Text>
        </View>

        <View style={styles.statCard}>
          <Users size={30} color="#4CAF50" />
          <Text style={styles.statValue}>42</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Games</Text>
        <Text style={styles.gameText}>• God of War Ragnarök</Text>
        <Text style={styles.gameText}>• Spider-Man 2</Text>
        <Text style={styles.gameText}>• Horizon Forbidden West</Text>
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
    backgroundColor: '#0070F3',
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0070F3',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  accountId: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  gameText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
