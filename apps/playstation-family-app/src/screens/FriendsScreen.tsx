import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { UserCircle } from 'lucide-react-native';

const mockFriends = [
  { id: '1', username: 'GamerPro123', status: 'online', game: 'Spider-Man 2' },
  { id: '2', username: 'PSNinja', status: 'online', game: 'God of War' },
  { id: '3', username: 'TrophyHunter', status: 'offline', game: null },
  { id: '4', username: 'RacerX', status: 'online', game: 'Gran Turismo 7' },
];

export const FriendsScreen = () => {
  const renderFriend = ({ item }: any) => (
    <View style={styles.friendCard}>
      <UserCircle size={50} color="#0070F3" />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.status === 'online' ? '#4CAF50' : '#999' }
          ]} />
          <Text style={styles.statusText}>
            {item.status === 'online' ? `Playing ${item.game}` : 'Offline'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
      </View>
      <FlatList
        data={mockFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    padding: 15,
  },
  friendCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInfo: {
    marginLeft: 15,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
});
