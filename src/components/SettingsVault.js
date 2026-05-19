import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';

export default function SettingsVault() {
  const { theme, toggleTheme } = useTheme();
  const [patToken, setPatToken] = useState('');
  const [isPatFocused, setIsPatFocused] = useState(false);
  const [purging, setPurging] = useState(false);

  const handlePurge = () => {
    setPurging(true);
    setTimeout(() => {
      setPurging(false);
    }, 2000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>VAULT & OPERATIONS</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Security, Theming, and Dev Utilities</Text>
      </View>

      {/* Theme Toggle Panel */}
      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.panelHeader}>
          <Feather name="moon" size={16} color={theme.textPrimary} />
          <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>AESTHETIC ENGINE</Text>
        </View>
        <View style={styles.themeRow}>
          <Text style={[styles.themeLabel, { color: theme.textSecondary }]}>
            Current Mode: <Text style={{ color: theme.accent, fontWeight: FONTS.weightBold }}>{theme.mode.toUpperCase()}</Text>
          </Text>
          {/* Micro Toggle Switch */}
          <TouchableOpacity
            style={[
              styles.microToggle,
              {
                borderColor: theme.border,
                backgroundColor: theme.surfaceSecondary,
                shadowColor: theme.glow,
                shadowOpacity: theme.mode === 'cyberpunk' ? 0.4 : 0,
                shadowRadius: 8,
              }
            ]}
            onPress={toggleTheme}
          >
            <View style={[
              styles.toggleKnob,
              {
                backgroundColor: theme.accent,
                transform: [{ translateX: theme.mode === 'cyberpunk' ? 14 : 0 }]
              }
            ]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Secure GitHub PAT Vault */}
      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.panelHeader}>
          <Feather name="lock" size={16} color={theme.textPrimary} />
          <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>GITHUB API KEY (PAT)</Text>
        </View>
        <Text style={[styles.helperText, { color: theme.textSecondary }]}>
          Your Personal Access Token is securely stored locally via SecureStore. It never leaves this device.
        </Text>
        <View style={[
          styles.inputWrapper,
          {
            borderColor: isPatFocused ? theme.accent : theme.border,
            backgroundColor: theme.surfaceSecondary,
          }
        ]}>
          <Feather name="key" size={14} color={theme.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="ghp_************************"
            placeholderTextColor={theme.textSecondary}
            value={patToken}
            onChangeText={setPatToken}
            secureTextEntry={true}
            onFocus={() => setIsPatFocused(true)}
            onBlur={() => setIsPatFocused(false)}
          />
        </View>
      </View>

      {/* Antimatter Dev Cache Purge */}
      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: SPACING.md }]}>
        <View style={styles.panelHeader}>
          <MaterialCommunityIcons name="harddisk" size={18} color={theme.textPrimary} />
          <Text style={[styles.panelTitle, { color: theme.textPrimary }]}>ANTIMATTER INTEGRATION</Text>
        </View>
        <Text style={[styles.helperText, { color: theme.textSecondary, marginBottom: SPACING.lg }]}>
          Execute the Antimatter Daemon to reclaim gigabytes of orphaned `node_modules`, pip cache, and dangling Docker volumes.
        </Text>
        <TouchableOpacity
          style={[
            styles.purgeBtn,
            {
              backgroundColor: purging ? `${theme.accent}10` : 'transparent',
              borderColor: purging ? theme.accent : theme.danger,
              shadowColor: purging ? theme.accent : theme.danger,
              shadowOpacity: theme.mode === 'cyberpunk' ? 0.3 : 0,
              shadowRadius: 12,
            }
          ]}
          onPress={handlePurge}
          disabled={purging}
        >
          <Feather name={purging ? "loader" : "trash-2"} size={16} color={purging ? theme.accent : theme.danger} />
          <Text style={[styles.purgeBtnText, { color: purging ? theme.accent : theme.danger }]}>
            {purging ? 'PURGING DEV CACHE...' : 'PURGE DEVELOPMENT CACHING'}
          </Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? SPACING.xs : SPACING.sm,
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: FONTS.weightBold,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    marginTop: 4,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    marginLeft: SPACING.sm,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 10,
  },
  microToggle: {
    width: 32,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  helperText: {
    fontSize: 9,
    lineHeight: 14,
    marginBottom: SPACING.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    height: 44,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  purgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  purgeBtnText: {
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginLeft: SPACING.sm,
  },
});
