import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
    const user = await AsyncStorage.getItem(`user:${username}`);
    if (user) {
      Alert.alert('Error', 'User already exists');
      return;
    }
    await AsyncStorage.setItem(`user:${username}`, password);
    Alert.alert('Success', 'Registration successful! Please login.');
    setIsRegister(false);
    setUsername('');
    setPassword('');
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
    const storedPassword = await AsyncStorage.getItem(`user:${username}`);
    if (storedPassword === password) {
      onLogin(username);
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={isRegister ? handleRegister : handleLogin}
      >
        <Text style={styles.buttonText}>{isRegister ? 'Register' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.switchText}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1abc9c',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 32,
  },
  input: {
    width: 260,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: 260,
    height: 48,
    backgroundColor: '#16a085',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  switchText: {
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
