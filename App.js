import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Modal,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SPACING, FONTS } from './src/styles/theme';
import { ThemeProvider, useTheme } from './src/styles/ThemeContext';

import StatsGrid from './src/components/StatsGrid';
import ComputerVisionHub from './src/components/ComputerVisionHub';
import PipelineHealth from './src/components/PipelineHealth';
import SettingsVault from './src/components/SettingsVault';

// Extract the main app logic to consume the theme context
function MainApp() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [cvActiveTab, setCvActiveTab] = useState('hub');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  // Handle incoming screen requests from Dashboard stat cards
  const handleNavigateCard = (screenName) => {
    if (screenName === 'Inspection Engine') {
      setCvActiveTab('inspection_engine');
      setCurrentScreen('cv_hub');
    } else if (screenName === 'WingID' || screenName === 'Wing ID') {
      setCvActiveTab('wing_id');
      setCurrentScreen('cv_hub');
    } else if (screenName === 'Blink') {
      setCvActiveTab('blink');
      setCurrentScreen('cv_hub');
    } else {
      setModalTitle(screenName);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      {/* Screen Router */}
      <View style={styles.mainContent}>
        {currentScreen === 'home' && <StatsGrid onCardPress={handleNavigateCard} />}
        {currentScreen === 'cv_hub' && (
          <ComputerVisionHub activeTab={cvActiveTab} onTabChange={setCvActiveTab} />
        )}
        {currentScreen === 'pipeline' && <PipelineHealth />}
        {currentScreen === 'vault' && <SettingsVault />}
      </View>

      {/* Under Construction Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Feather name="lock" size={20} color={theme.accent} />
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>MODULE SHIELD</Text>
            </View>
            <Text style={[styles.modalBody, { color: theme.textSecondary }]}>
              {modalTitle} is currently offline for edge compilation. Tap the active modules on the Navigation bar to check out the live projects!
            </Text>
            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: theme.accent }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalCloseBtnText, { color: theme.background }]}>ACKNOWLEDGE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Icon-Only Bottom Navigation Bar (Dynamic Theming applied) */}
      <View style={[
        styles.bottomNav, 
        { 
          backgroundColor: theme.background, 
          borderColor: theme.border,
          shadowColor: theme.glow,
          shadowOpacity: theme.mode === 'cyberpunk' ? 0.3 : 0,
          shadowRadius: 10,
        }
      ]}>
        {/* Navigation Button: Ops Center (Home) */}
        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'home' && styles.navItemActive]}
          onPress={() => setCurrentScreen('home')}
        >
          <Feather
            name="grid"
            size={20}
            color={currentScreen === 'home' ? theme.accent : theme.textSecondary}
          />
          {currentScreen === 'home' && <View style={[styles.navIndicator, { backgroundColor: theme.accent }]} />}
        </TouchableOpacity>

        {/* Navigation Button: Computer Vision Hub (Nodes) */}
        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'cv_hub' && styles.navItemActive]}
          onPress={() => {
            setCurrentScreen('cv_hub');
            setCvActiveTab('hub');
          }}
        >
          <Feather
            name="cpu"
            size={20}
            color={currentScreen === 'cv_hub' ? theme.accentSecondary : theme.textSecondary}
          />
          {currentScreen === 'cv_hub' && <View style={[styles.navIndicator, { backgroundColor: theme.accentSecondary }]} />}
        </TouchableOpacity>

        {/* Navigation Button: Pipeline Health (Logistics) */}
        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'pipeline' && styles.navItemActive]}
          onPress={() => setCurrentScreen('pipeline')}
        >
          <Feather
            name="git-merge"
            size={20}
            color={currentScreen === 'pipeline' ? theme.accent : theme.textSecondary}
          />
          {currentScreen === 'pipeline' && <View style={[styles.navIndicator, { backgroundColor: theme.accent }]} />}
        </TouchableOpacity>

        {/* Navigation Button: Settings Vault */}
        <TouchableOpacity
          style={[styles.navItem, currentScreen === 'vault' && styles.navItemActive]}
          onPress={() => setCurrentScreen('vault')}
        >
          <Feather
            name="shield"
            size={20}
            color={currentScreen === 'vault' ? theme.accentSecondary : theme.textSecondary}
          />
          {currentScreen === 'vault' && <View style={[styles.navIndicator, { backgroundColor: theme.accentSecondary }]} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Wrap with Provider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
  },

  // Bottom Navigation Layout (compensated for Android physical/gesture home controls)
  bottomNav: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 80 : 64,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 20 : 4,
  },
  navItem: {
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navItemActive: {
    opacity: 1,
  },
  navIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Modal styling
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '90%',
    borderWidth: 1,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: FONTS.weightBold,
    letterSpacing: 2,
    marginLeft: SPACING.sm,
  },
  modalBody: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalCloseBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
  },
});
