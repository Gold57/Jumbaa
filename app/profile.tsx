import { View, Text, TextInput, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; // Update the path to your actual config

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
          } else {
            console.warn('No such user document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      setUpdating(true);

      const userRef = doc(db, 'users', currentUser.uid);

      await updateDoc(userRef, {
        firstName,
        lastName,
      });

      Alert.alert('Success', 'Profile updated successfully');
      setUserProfile((prev) =>
        prev ? { ...prev, firstName, lastName } : null
      );
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Could not update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete user document from Firestore
              const userRef = doc(db, 'users', currentUser.uid);
              await deleteDoc(userRef);

              // Delete the user from Firebase Auth
              await deleteUser(currentUser);

              // Sign out the user
              await signOut(auth);

              Alert.alert('Success', 'Your account has been deleted.');

              // Optionally, navigate to a different screen or go to the login page
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Could not delete account');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <Text style={{ color: 'red' }}>User profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userProfile.email}</Text>
        <Text style={styles.warning}>Email cannot be updated from this screen.</Text>
      </View>

      <Button
        title={updating ? 'Updating...' : 'Save Changes'}
        onPress={handleUpdateProfile}
        disabled={updating}
      />

      <Button
        title="Delete Account"
        onPress={handleDeleteAccount}
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 30,
  },
  infoBox: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e1e1e',
  },
  input: {
    fontSize: 18,
    paddingVertical: 5,
    color: '#1e1e1e',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
});
