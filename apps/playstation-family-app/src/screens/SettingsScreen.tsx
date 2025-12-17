import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Bell, Lock, Globe, HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export const SettingsScreen = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const SettingItem = ({ icon: Icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Icon size={24} color="#0070F3" />
      <Text style={styles.settingText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <SettingItem
          icon={Bell}
          title="Notifications"
          onPress={() => Alert.alert('Notifications', 'Configure notifications')}
        />
        <SettingItem
          icon={Lock}
          title="Privacy & Security"
          onPress={() => Alert.alert('Privacy', 'Configure privacy settings')}
        />
        <SettingItem
          icon={Globe}
          title="Language & Region"
          onPress={() => Alert.alert('Language', 'Select language')}
        />
        <SettingItem
          icon={HelpCircle}
          title="Help & Support"
          onPress={() => Alert.alert('Help', 'Get help and support')}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  section: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
});
