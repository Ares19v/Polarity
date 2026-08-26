import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample defect & target presets for live simulation
const SIMULATION_TARGETS = {
  inspection_engine: [
    { id: '1', label: 'SOLDER_BRIDGE', confidence: 0.96, x: 0.22, y: 0.32, w: 0.32, h: 0.20, color: '#FF2E93' },
    { id: '2', label: 'MISSING_CAP_0805', confidence: 0.91, x: 0.60, y: 0.50, w: 0.25, h: 0.16, color: '#FF8A00' },
    { id: '3', label: 'SPUR_DEFECT', confidence: 0.88, x: 0.30, y: 0.65, w: 0.22, h: 0.14, color: '#FF2E93' },
  ],
  wing_id: [
    { id: '1', label: 'MQ-9 REAPER // UAV', confidence: 0.98, x: 0.18, y: 0.26, w: 0.64, h: 0.38, color: '#00F5FF', alt: '3,200m MSL', speed: '240 KT' },
  ],
  blink: [
    { id: '1', label: 'LEFT_EYE: EAR 0.31', confidence: 0.94, x: 0.26, y: 0.36, w: 0.20, h: 0.14, color: '#58D5BA' },
    { id: '2', label: 'RIGHT_EYE: EAR 0.29', confidence: 0.93, x: 0.54, y: 0.36, w: 0.20, h: 0.14, color: '#58D5BA' },
  ],
};

export default function CameraViewport({ initialMode = 'inspection_engine', onClose }) {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState(initialMode === 'blink' ? 'front' : 'back');
  const [activeMode, setActiveMode] = useState(initialMode);
  const [isScanning, setIsScanning] = useState(true);
  const [detectedTargets, setDetectedTargets] = useState(SIMULATION_TARGETS[initialMode] || []);
  const [flashMode, setFlashMode] = useState(false);
  const [inferenceLatency, setInferenceLatency] = useState(38);

  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Scanning laser animation
  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isScanning]);

  const handleSwitchMode = (mode) => {
    setActiveMode(mode);
    setFacing(mode === 'blink' ? 'front' : 'back');
    setDetectedTargets(SIMULATION_TARGETS[mode] || []);
  };

  const handleToggleScan = () => {
    setIsScanning(!isScanning);
    if (!isScanning) {
      setInferenceLatency(Math.floor(28 + Math.random() * 20));
    }
  };

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, SCREEN_HEIGHT - 240],
  });

  return (
    <View style={styles.container}>
      {/* 1. Live Camera Layer */}
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          enableTorch={flashMode}
        />
      ) : (
        <View style={[styles.fallbackBackground, { backgroundColor: '#09090A' }]}>
          <MaterialCommunityIcons name="camera-off" size={48} color={theme.textSecondary} />
          <Text style={[styles.permissionText, { color: theme.textPrimary }]}>Camera Access Required</Text>
          <TouchableOpacity
            style={[styles.permissionBtn, { backgroundColor: theme.accent }]}
            onPress={requestPermission}
          >
            <Text style={[styles.permissionBtnText, { color: theme.background }]}>ENABLE CAMERA</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. Tactical Viewfinder Brackets */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {/* Top Left Bracket */}
        <View style={[styles.bracketTL, { borderColor: theme.accent }]} />
        {/* Top Right Bracket */}
        <View style={[styles.bracketTR, { borderColor: theme.accent }]} />
        {/* Bottom Left Bracket */}
        <View style={[styles.bracketBL, { borderColor: theme.accent }]} />
        {/* Bottom Right Bracket */}
        <View style={[styles.bracketBR, { borderColor: theme.accent }]} />

        {/* Center Crosshair Reticle */}
        <View style={styles.centerReticle}>
          <View style={[styles.reticleRing, { borderColor: `${theme.accent}60` }]} />
          <View style={[styles.reticleH, { backgroundColor: theme.accent }]} />
          <View style={[styles.reticleV, { backgroundColor: theme.accent }]} />
        </View>

        {/* 3. Rendered Dynamic Bounding Boxes */}
        {isScanning && detectedTargets.map((target) => {
          const bx = target.x * SCREEN_WIDTH;
          const by = target.y * SCREEN_HEIGHT;
          const bw = target.w * SCREEN_WIDTH;
          const bh = target.h * SCREEN_HEIGHT;
          const boxColor = target.color || theme.accent;

          return (
            <View
              key={target.id}
              style={[
                styles.bboxContainer,
                {
                  left: bx,
                  top: by,
                  width: bw,
                  height: bh,
                  borderColor: boxColor,
                  backgroundColor: `${boxColor}15`,
                  shadowColor: boxColor,
                  shadowOpacity: 0.6,
                  shadowRadius: 8,
                }
              ]}
            >
              {/* Corner tick marks */}
              <View style={[styles.cornerTL, { borderColor: boxColor }]} />
              <View style={[styles.cornerTR, { borderColor: boxColor }]} />
              <View style={[styles.cornerBL, { borderColor: boxColor }]} />
              <View style={[styles.cornerBR, { borderColor: boxColor }]} />

              {/* Tag Pill */}
              <View style={[styles.tagPill, { backgroundColor: boxColor }]}>
                <Text style={styles.tagPillText} numberOfLines={1}>
                  {target.label} ({(target.confidence * 100).toFixed(0)}%)
                </Text>
              </View>

              {/* Extra Telemetry (for WingID / Altitude Math) */}
              {target.alt && (
                <View style={[styles.altPill, { backgroundColor: 'rgba(9, 9, 10, 0.85)', borderColor: boxColor }]}>
                  <Text style={[styles.altPillText, { color: boxColor }]}>
                    ALT: {target.alt} // SPD: {target.speed}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* 4. Animated Scanning Laser Line */}
      {isScanning && (
        <Animated.View
          style={[
            styles.laserLine,
            {
              transform: [{ translateY }],
              backgroundColor: theme.accent,
              shadowColor: theme.accent,
              shadowOpacity: 0.9,
              shadowRadius: 10,
            }
          ]}
        />
      )}

      {/* 5. Top Telemetry HUD Header */}
      <View style={styles.topHudBar}>
        <TouchableOpacity style={styles.hudIconBtn} onPress={onClose}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.telemetryTagGroup}>
          <View style={styles.telemetryPill}>
            <Text style={styles.telemetryPillLabel}>ENGINE</Text>
            <Text style={[styles.telemetryPillValue, { color: theme.accent }]}>
              {activeMode === 'inspection_engine' ? 'YOLOv11s-PCB' : activeMode === 'wing_id' ? 'YOLO-UAV-RT' : 'EAR-FACIAL'}
            </Text>
          </View>

          <View style={styles.telemetryPill}>
            <Text style={styles.telemetryPillLabel}>LATENCY</Text>
            <Text style={[styles.telemetryPillValue, { color: theme.accent }]}>{inferenceLatency}ms</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.hudIconBtn}
          onPress={() => setFlashMode(!flashMode)}
        >
          <Feather name={flashMode ? 'zap' : 'zap-off'} size={18} color={flashMode ? theme.accent : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      {/* 6. Mode Selector Floating Bar */}
      <View style={[styles.modeBar, { backgroundColor: 'rgba(9, 9, 10, 0.8)', borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.modeBtn, activeMode === 'inspection_engine' && { backgroundColor: `${theme.accent}25`, borderColor: theme.accent }]}
          onPress={() => handleSwitchMode('inspection_engine')}
        >
          <MaterialCommunityIcons name="memory" size={14} color={activeMode === 'inspection_engine' ? theme.accent : '#8E8E93'} />
          <Text style={[styles.modeBtnText, { color: activeMode === 'inspection_engine' ? theme.accent : '#8E8E93' }]}>PCB INSPECT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, activeMode === 'wing_id' && { backgroundColor: `${theme.accentSecondary}25`, borderColor: theme.accentSecondary }]}
          onPress={() => handleSwitchMode('wing_id')}
        >
          <MaterialCommunityIcons name="airplane" size={14} color={activeMode === 'wing_id' ? theme.accentSecondary : '#8E8E93'} />
          <Text style={[styles.modeBtnText, { color: activeMode === 'wing_id' ? theme.accentSecondary : '#8E8E93' }]}>WING ID</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, activeMode === 'blink' && { backgroundColor: `${theme.accent}25`, borderColor: theme.accent }]}
          onPress={() => handleSwitchMode('blink')}
        >
          <Feather name="eye" size={14} color={activeMode === 'blink' ? theme.accent : '#8E8E93'} />
          <Text style={[styles.modeBtnText, { color: activeMode === 'blink' ? theme.accent : '#8E8E93' }]}>BLINK EAR</Text>
        </TouchableOpacity>
      </View>

      {/* 7. Bottom Capture & Stream Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.flipCameraBtn}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
        >
          <Feather name="refresh-cw" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Master Shutter / Stream Button */}
        <TouchableOpacity
          style={[
            styles.shutterOuter,
            { borderColor: isScanning ? theme.accent : '#555555' }
          ]}
          onPress={handleToggleScan}
        >
          <Animated.View
            style={[
              styles.shutterInner,
              {
                backgroundColor: isScanning ? theme.accent : '#FF2E93',
                transform: [{ scale: isScanning ? pulseAnim : 1 }]
              }
            ]}
          >
            <Feather name={isScanning ? 'activity' : 'play'} size={24} color="#09090A" />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.simulateTargetBtn}
          onPress={() => {
            // Randomize bboxes to test dynamic tracking
            const updated = (SIMULATION_TARGETS[activeMode] || []).map(t => ({
              ...t,
              x: Math.max(0.12, Math.min(0.58, t.x + (Math.random() - 0.5) * 0.12)),
              y: Math.max(0.18, Math.min(0.62, t.y + (Math.random() - 0.5) * 0.12)),
              confidence: Number((0.89 + Math.random() * 0.10).toFixed(2)),
            }));
            setDetectedTargets(updated);
            setInferenceLatency(Math.floor(25 + Math.random() * 20));
          }}
        >
          <MaterialCommunityIcons name="target" size={22} color={theme.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fallbackBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  permissionText: {
    fontSize: 14,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  permissionBtn: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  permissionBtnText: {
    fontSize: 11,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
  },
  bracketTL: {
    position: 'absolute',
    top: 130,
    left: 30,
    width: 36,
    height: 36,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  bracketTR: {
    position: 'absolute',
    top: 130,
    right: 30,
    width: 36,
    height: 36,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bracketBL: {
    position: 'absolute',
    bottom: 150,
    left: 30,
    width: 36,
    height: 36,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bracketBR: {
    position: 'absolute',
    bottom: 150,
    right: 30,
    width: 36,
    height: 36,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  centerReticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    marginLeft: -30,
    marginTop: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  reticleH: {
    position: 'absolute',
    width: 24,
    height: 1,
  },
  reticleV: {
    position: 'absolute',
    width: 1,
    height: 24,
  },
  bboxContainer: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 4,
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 8,
    height: 8,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 8,
    height: 8,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  tagPill: {
    position: 'absolute',
    top: -18,
    left: -1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
  },
  tagPillText: {
    color: '#09090A',
    fontSize: 8.5,
    fontWeight: FONTS.weightBold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  altPill: {
    position: 'absolute',
    bottom: -20,
    left: -1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 0.5,
  },
  altPillText: {
    fontSize: 7.5,
    fontWeight: FONTS.weightBold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  laserLine: {
    position: 'absolute',
    left: 30,
    right: 30,
    height: 2,
    zIndex: 10,
  },
  topHudBar: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 44 : 54,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  hudIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(9, 9, 10, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  telemetryTagGroup: {
    flexDirection: 'row',
  },
  telemetryPill: {
    backgroundColor: 'rgba(9, 9, 10, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  telemetryPillLabel: {
    fontSize: 7,
    color: '#8E8E93',
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },
  telemetryPillValue: {
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 1,
  },
  modeBar: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 96 : 106,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 25,
    elevation: 25,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeBtnText: {
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 36 : 48,
    left: SPACING.xl,
    right: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
    elevation: 20,
  },
  flipCameraBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(9, 9, 10, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulateTargetBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(9, 9, 10, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(9, 9, 10, 0.5)',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
