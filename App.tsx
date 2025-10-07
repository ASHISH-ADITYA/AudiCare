import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import TalkScreen from './TalkScreen';

const { width } = Dimensions.get('window');

const App = () => {
  // Read API key from Expo config extra or manifest
  const runtimeExtra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};
  const GIMIN_API_KEY = runtimeExtra.GIMIN_API_KEY || '';

  const [talkVisible, setTalkVisible] = useState(false);
  const openTalk = () => setTalkVisible(true);
  const closeTalk = () => setTalkVisible(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-width * 0.75)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    };
    startRotation();
  }, [rotateAnimation]);

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -width * 0.75 : 0;
    
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 400,
      useNativeDriver: true,
    }).start();
    
    setSidebarVisible(!sidebarVisible);
  };

  const menuItems = [
    { icon: '🎯', title: 'Accurate Diagnosis', description: 'AI-powered health analysis' },
    { icon: '🔔', title: 'Generate Alerts', description: 'Timely health notifications' },
    { icon: '🤖', title: 'Real-Time Guidance', description: 'Virtual assistance 24/7' },
    { icon: '👨‍⚕️', title: 'Connect with Doc', description: 'Direct communication channel' },
    { icon: '🔒', title: 'Data Privacy', description: 'Secure & encrypted data' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1abc9c', '#16a085']}
        style={styles.phoneFrame}
      >
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={toggleSidebar}
          activeOpacity={0.8}
        >
          <View style={[styles.hamburgerLine, sidebarVisible && styles.hamburgerLineActive1]} />
          <View style={[styles.hamburgerLine, sidebarVisible && styles.hamburgerLineActive2]} />
          <View style={[styles.hamburgerLine, sidebarVisible && styles.hamburgerLineActive3]} />
        </TouchableOpacity>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: sidebarAnimation }],
            },
          ]}
        >
          <LinearGradient
            colors={['#16a085', '#1abc9c']}
            style={styles.sidebarGradient}
          >
            <View style={styles.sidebarHeader}>
              <View style={styles.sidebarLogo}>
                <Text style={styles.sidebarLogoIcon}>💚</Text>
              </View>
              <Text style={styles.sidebarTitle}>Features Menu</Text>
            </View>

            <ScrollView style={styles.sidebarMenu}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => setSidebarVisible(false)}
                  activeOpacity={0.8}
                >
                  <View style={styles.menuIcon}>
                    <Text style={styles.menuIconText}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </Animated.View>

        {/* Overlay */}
        {sidebarVisible && (
          <TouchableOpacity
            style={styles.overlay}
            onPress={toggleSidebar}
            activeOpacity={1}
          />
        )}

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View 
              style={[
                styles.logoCircle,
                {
                  transform: [{
                    rotate: rotateAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  }],
                },
              ]}
            >
              <View style={styles.heartIcon}>
                <Text style={styles.heartIconText}>💚</Text>
              </View>
            </Animated.View>
            <Text style={styles.brandName}>AudiCare</Text>
            <View style={styles.brandUnderline} />
          </View>

          {/* Main Title */}
          <Text style={styles.mainTitle}>AUDICARE</Text>
          <Text style={styles.subtitle}>Your Health Journey Starts Here</Text>

          {/* Dashboard Cards */}
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardCard}>
              <Text style={styles.cardTitle}>Health Overview</Text>
              <Text style={styles.cardContent}>
                Welcome to your health dashboard. Track your symptoms, get diagnoses, and stay connected with healthcare professionals.
              </Text>
            </View>

            <View style={styles.dashboardCard}>
              <Text style={styles.cardTitle}>Quick Stats</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Checkups</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>Alerts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>98%</Text>
                  <Text style={styles.statLabel}>Accuracy</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>24/7</Text>
                  <Text style={styles.statLabel}>Support</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Text style={styles.navIcon}>🎯</Text>
            <Text style={styles.navLabel}>Quest</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Text style={styles.navIcon}>📓</Text>
            <Text style={styles.navLabel}>Journal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.talkButton} activeOpacity={0.8} onPress={openTalk}>
            <Text style={styles.talkIcon}>💬</Text>
            <Text style={styles.talkButtonText}>Talk with Us</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <TalkScreen visible={talkVisible} onClose={closeTalk} apiKey={GIMIN_API_KEY} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneFrame: {
    width: Math.min(400, width - 40),
    height: '90%',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 20,
    overflow: 'hidden',
  },
  // Hamburger Menu
  hamburgerBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
    marginVertical: 2,
  },
  hamburgerLineActive1: {
    transform: [{ rotate: '45deg' }, { translateY: 7 }],
  },
  hamburgerLineActive2: {
    opacity: 0,
  },
  hamburgerLineActive3: {
    transform: [{ rotate: '-45deg' }, { translateY: -7 }],
  },
  // Sidebar
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    zIndex: 999,
  },
  sidebarGradient: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sidebarHeader: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  sidebarLogo: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sidebarLogoIcon: {
    fontSize: 30,
  },
  sidebarTitle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  sidebarMenu: {
    paddingVertical: 20,
  },
  menuItem: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  menuIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  // Main Content
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heartIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIconText: {
    fontSize: 24,
    color: '#1abc9c',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  brandUnderline: {
    width: 100,
    height: 3,
    backgroundColor: 'white',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  // Dashboard Cards
  dashboardContainer: {
    flex: 1,
    gap: 20,
    paddingBottom: 20,
  },
  dashboardCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1abc9c',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1abc9c',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  // Bottom Navigation
  bottomNav: {
    backgroundColor: '#16a085',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    gap: 6,
  },
  navIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  navLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  talkButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  talkIcon: {
    fontSize: 18,
    color: 'white',
  },
  talkButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
});

export default App;