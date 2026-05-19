import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';

export default function StatsGrid({ onCardPress }) {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Header Row: Title & Telemetry Widget */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>OPS CENTER</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Local Daemon connected</Text>
        </View>

        {/* Mocked Cryo Telemetry Widget */}
        <View style={[
          styles.telemetryWidget, 
          { 
            backgroundColor: theme.surface, 
            borderColor: theme.border,
            shadowColor: theme.glow,
            shadowOpacity: theme.mode === 'cyberpunk' ? 0.3 : 0,
            shadowRadius: 10,
          }
        ]}>
          <View style={styles.telemetryRow}>
            <Text style={[styles.telemetryLabel, { color: theme.textSecondary }]}>CPU</Text>
            <Text style={[styles.telemetryValue, { color: theme.accent }]}>54°C</Text>
          </View>
          <View style={styles.telemetryRow}>
            <Text style={[styles.telemetryLabel, { color: theme.textSecondary }]}>FAN</Text>
            <Text style={[styles.telemetryValue, { color: theme.textPrimary }]}>2400 RPM</Text>
          </View>
          <View style={styles.telemetryRow}>
            <Text style={[styles.telemetryLabel, { color: theme.textSecondary }]}>VRAM</Text>
            <Text style={[styles.telemetryValue, { color: theme.textPrimary }]}>4.2/16G</Text>
          </View>
        </View>
      </View>

      {/* Shylock Market Sentiment Ticker */}
      <View style={[styles.tickerContainer, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
        <Feather name="trending-up" size={14} color={theme.accent} style={styles.tickerIcon} />
        <Text style={[styles.tickerText, { color: theme.textPrimary }]} numberOfLines={1}>
          <Text style={{ color: theme.textSecondary }}>TSLA: </Text>84% Bullish <Text style={{ color: theme.accent }}>●</Text>   <Text style={{ color: theme.textSecondary }}>NVDA: </Text>91% Strong Bullish <Text style={{ color: theme.accent }}>●</Text>   <Text style={{ color: theme.textSecondary }}>AAPL: </Text>48% Neutral <Text style={{ color: theme.textSecondary }}>●</Text>
        </Text>
      </View>

      {/* Operations Quick-Launch Grid */}
      <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>ACTIVE NODES & HUBS</Text>
      
      <View style={styles.gridContainer}>
        {/* Card 1: PCB Detection */}
        <TouchableOpacity
          style={[
            styles.statCard, 
            { 
              backgroundColor: theme.surface, 
              borderColor: theme.border,
              shadowColor: theme.glow,
              shadowOpacity: theme.mode === 'cyberpunk' ? 0.2 : 0,
              shadowRadius: 8,
            }
          ]}
          onPress={() => onCardPress('Inspection Engine')}
        >
          <View style={styles.statCardHeader}>
            <MaterialCommunityIcons name="memory" size={16} color={theme.accent} />
            <Text style={[styles.statCardName, { color: theme.textSecondary }]}>INSPECTION ENGINE</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>4,852</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total PCBs Scanned</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${theme.accent}15` }]}>
            <Text style={[styles.statusBadgeText, { color: theme.accent }]}>[ONLINE]</Text>
          </View>
        </TouchableOpacity>

        {/* Card 2: Blink Eye Fatigue Monitor */}
        <TouchableOpacity
          style={[
            styles.statCard, 
            { 
              backgroundColor: theme.surface, 
              borderColor: theme.border,
              shadowColor: theme.glow,
              shadowOpacity: theme.mode === 'cyberpunk' ? 0.2 : 0,
              shadowRadius: 8,
            }
          ]}
          onPress={() => onCardPress('Blink')}
        >
          <View style={styles.statCardHeader}>
            <Feather name="eye" size={16} color={theme.accentSecondary} />
            <Text style={[styles.statCardName, { color: theme.textSecondary }]}>BLINK</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>14 <Text style={{ fontSize: 12, fontWeight: '400' }}>BPM</Text></Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Fatigue: Optimal</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${theme.accentSecondary}15` }]}>
            <Text style={[styles.statusBadgeText, { color: theme.accentSecondary }]}>[ONLINE]</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3: Limitless RAG */}
        <TouchableOpacity
          style={[
            styles.statCard, 
            { 
              backgroundColor: theme.surface, 
              borderColor: theme.border,
              shadowColor: theme.glow,
              shadowOpacity: theme.mode === 'cyberpunk' ? 0.2 : 0,
              shadowRadius: 8,
            }
          ]}
          onPress={() => onCardPress('Limitless')}
        >
          <View style={styles.statCardHeader}>
            <MaterialCommunityIcons name="brain" size={16} color={theme.accent} />
            <Text style={[styles.statCardName, { color: theme.textSecondary }]}>LIMITLESS</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>148</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Docs Vectorized</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${theme.danger}15` }]}>
            <Text style={[styles.statusBadgeText, { color: theme.danger }]}>[OFFLINE]</Text>
          </View>
        </TouchableOpacity>

        {/* Card 4: Wing ID */}
        <TouchableOpacity
          style={[
            styles.statCard, 
            { 
              backgroundColor: theme.surface, 
              borderColor: theme.border,
              shadowColor: theme.glow,
              shadowOpacity: theme.mode === 'cyberpunk' ? 0.2 : 0,
              shadowRadius: 8,
            }
          ]}
          onPress={() => onCardPress('WingID')}
        >
          <View style={styles.statCardHeader}>
            <MaterialCommunityIcons name="airplane" size={16} color={theme.accentSecondary} />
            <Text style={[styles.statCardName, { color: theme.textSecondary }]}>WING ID</Text>
          </View>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>852</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Flights Tracked</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${theme.accentSecondary}15` }]}>
            <Text style={[styles.statusBadgeText, { color: theme.accentSecondary }]}>[ONLINE]</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? SPACING.xs : SPACING.sm,
    marginBottom: SPACING.md,
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
  telemetryWidget: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 120,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  telemetryLabel: {
    fontSize: 8,
    fontWeight: FONTS.weightBold,
  },
  telemetryValue: {
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightBold,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: SPACING.lg,
  },
  tickerIcon: {
    marginRight: 10,
  },
  tickerText: {
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    height: 136,
    position: 'relative',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statCardName: {
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
    marginLeft: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: FONTS.weightBold,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: FONTS.weightSemiBold,
    marginTop: 2,
  },
  statusBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightBold,
  },
});
