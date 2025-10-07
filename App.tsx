import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

// A simple component for the bottom navigation icons
const NavItem = ({ icon, label }: { icon: string; label: string }) => (
  <TouchableOpacity style={styles.navItem}>
    <View style={styles.navIconContainer}>
      <Text style={styles.navIcon}>{icon}</Text>
    </View>
    <Text style={styles.navLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function App() {
  // Animation for the main content to slide up
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
      delay: 200,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 200,
    }).start();
  }, [slideUpAnim, opacityAnim]);

  return (
    <LinearGradient
      colors={['#1e40af', '#0ea5e9', '#06b6d4']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: slideUpAnim }], opacity: opacityAnim },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💊</Text>
          </View>
          <Text style={styles.title}>Welcome to AudiCare</Text>
          <Text style={styles.subtitle}>Your Smart Health Companion</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.characterContainer,
            { transform: [{ translateY: slideUpAnim }], opacity: opacityAnim },
          ]}
        >
          <View style={styles.character}>
            <Text style={styles.characterText}>👨‍⚕️</Text>
          </View>
          <View style={styles.character}>
            <Text style={styles.characterText}>👩‍⚕️</Text>
          </View>
          <View style={styles.character}>
            <Text style={styles.characterText}>🩺</Text>
          </View>
        </Animated.View>

        <Animated.View style={{width: '100%', alignItems: 'center', opacity: opacityAnim, transform: [{ translateY: slideUpAnim }] }}>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Start Symptom Check</Text>
            </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomNav}>
          <NavItem icon="🏠" label="Home" />
          <NavItem icon="🩺" label="Checkup" />
          <NavItem icon="📔" label="Records" />
          <NavItem icon="👤" label="Profile" />
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  logoIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  characterContainer: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 30,
  },
  character: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  characterText: {
    fontSize: 40,
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '110%', // A bit wider to avoid edge cutoff
    height: 80,
    backgroundColor: 'rgba(30, 64, 175, 0.85)',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
});