import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../styles/theme';

export default function Blink() {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [fatigueScore, setFatigueScore] = useState(12);
  const [bpm, setBpm] = useState(14);
  const [duration, setDuration] = useState(120);

  // Simple mock value rotation for live effect
  useEffect(() => {
    if (!isCalibrated) return;
    const interval = setInterval(() => {
      setBpm(Math.floor(Math.random() * (18 - 12 + 1) + 12));
      setDuration(Math.floor(Math.random() * (150 - 90 + 1) + 90));
      setFatigueScore(Math.floor(Math.random() * (20 - 10 + 1) + 10));
    }, 2000);
    return () => clearInterval(interval);
  }, [isCalibrated]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="eye" size={18} color="#FFD700" />
          <Text style={styles.headerTitle}>Blink Engine</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>MediaPipe Active</Text>
        </View>
      </View>

      {/* Camera / Calibration HUD */}
      <View style={styles.cameraFrame}>
        {!isCalibrated ? (
          <View style={styles.calibrationOverlay}>
            <MaterialCommunityIcons name="face-recognition" size={40} color={COLORS.textSecondary} />
            <Text style={styles.calibrationText}>AWAITING EAR CALIBRATION</Text>
            <TouchableOpacity 
              style={styles.calibrateBtn}
              onPress={() => setIsCalibrated(true)}
            >
              <Text style={styles.calibrateBtnText}>START 7s CALIBRATION</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeTracker}>
            {/* Viewfinder crosshairs */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            
            <View style={styles.faceTarget}>
              <View style={styles.eyeTargetLeft} />
              <View style={styles.eyeTargetRight} />
            </View>
            <Text style={styles.trackingText}>TRACKING EAR VECTORS</Text>
          </View>
        )}
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>BLINK RATE</Text>
          <Text style={styles.metricValue}>{isCalibrated ? bpm : '--'}</Text>
          <Text style={styles.metricUnit}>bpm</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>DURATION</Text>
          <Text style={styles.metricValue}>{isCalibrated ? duration : '--'}</Text>
          <Text style={styles.metricUnit}>ms</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>FATIGUE</Text>
          <Text style={[styles.metricValue, { color: isCalibrated ? (fatigueScore > 50 ? COLORS.accentRed : COLORS.accentGreen) : COLORS.textPrimary }]}>
            {isCalibrated ? fatigueScore : '--'}
          </Text>
          <Text style={styles.metricUnit}>score (0-100)</Text>
        </View>
      </View>

      {/* EAR Graph Mockup */}
      <View style={styles.graphCard}>
        <View style={styles.graphHeader}>
          <Text style={styles.graphTitle}>EYE ASPECT RATIO (EAR)</Text>
          <Text style={styles.graphValue}>0.28</Text>
        </View>
        <View style={styles.graphArea}>
          {/* Mock vertical bars representing rolling buffer */}
          {Array.from({ length: 30 }).map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.bar, 
                { height: isCalibrated ? Math.random() * 40 + 10 : 2 },
                i % 8 === 0 && isCalibrated && { height: 4, backgroundColor: COLORS.accentRed } // simulated blinks
              ]} 
            />
          ))}
        </View>
      </View>

      {/* 20-20-20 Rule Timer */}
      <View style={styles.timerCard}>
        <View style={styles.timerIconWrapper}>
          <Feather name="clock" size={24} color="#FFD700" />
        </View>
        <View style={styles.timerInfo}>
          <Text style={styles.timerTitle}>20-20-20 RULE</Text>
          <Text style={styles.timerSubtitle}>Next look-away reminder in</Text>
        </View>
        <Text style={styles.timerClock}>14:22</Text>
      </View>
      
      <View style={{ height: Platform.OS === 'android' ? 40 : 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: FONTS.weightBold,
    marginLeft: SPACING.sm,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFD700',
    fontSize: 8,
    fontWeight: FONTS.weightBold,
  },
  cameraFrame: {
    height: 220,
    backgroundColor: '#0C0C0E',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  calibrationOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calibrationText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  calibrateBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  calibrateBtnText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
  },
  activeTracker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingText: {
    position: 'absolute',
    bottom: 16,
    color: COLORS.accentGreen,
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    letterSpacing: 2,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.textSecondary,
  },
  tl: { top: 16, left: 16, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 16, right: 16, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 16, left: 16, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 16, right: 16, borderBottomWidth: 2, borderRightWidth: 2 },
  faceTarget: {
    width: 120,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  eyeTargetLeft: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: COLORS.accentGreen,
    borderRadius: 6,
  },
  eyeTargetRight: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: COLORS.accentGreen,
    borderRadius: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: FONTS.weightBold,
  },
  metricUnit: {
    color: COLORS.textSecondary,
    fontSize: 8,
    marginTop: 2,
  },
  graphCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  graphTitle: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
  },
  graphValue: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: FONTS.weightBold,
  },
  graphArea: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bar: {
    width: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderRadius: 2,
  },
  timerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  timerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  timerInfo: {
    flex: 1,
  },
  timerTitle: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
  },
  timerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 9,
    marginTop: 4,
  },
  timerClock: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: FONTS.weightBold,
  },
});
