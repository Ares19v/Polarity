import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../styles/theme';

// Mock UAV Targets based on real CLIP designations and physical wingspans
const AIRCRAFT_DATABASE = [
  {
    name: 'MQ-9 Reaper UAV (Hunter-Killer)',
    wingspan: 20.0,
    clipLabel: 'MQ-9 Reaper Military Drone UAV with hellfires',
    code: 'UAV-MQ9',
    baseSpeed: 210,
  },
  {
    name: 'F-22 Raptor (Stealth Fighter)',
    wingspan: 13.6,
    clipLabel: 'F-22 Raptor Stealth Fighter Jet flying at supersonic speeds',
    code: 'FIGHTER-F22',
    baseSpeed: 1220,
  },
  {
    name: 'MQ-4C Triton (Surveillance)',
    wingspan: 39.9,
    clipLabel: 'MQ-4C Triton High-Altitude Maritime Surveillance UAV',
    code: 'UAV-MQ4C',
    baseSpeed: 320,
  },
  {
    name: 'A-10 Thunderbolt (Close Air Support)',
    wingspan: 17.5,
    clipLabel: 'A-10 Thunderbolt II Warthog ground-attack military aircraft',
    code: 'ATTACK-A10',
    baseSpeed: 300,
  },
];

export default function WingID() {
  const [isFeedActive, setIsFeedActive] = useState(true);
  const [activeAircraft, setActiveAircraft] = useState(AIRCRAFT_DATABASE[0]);
  const [boxWidth, setBoxWidth] = useState(240); // Pixel width of bounding box
  const [confidence, setConfidence] = useState(97.8);
  const [bearing, setBearing] = useState(142);
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Animation values
  const [scanLineY, setScanLineY] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 45, y: 35 });

  // Constants matching the Technical Deep Dive exactly
  const FOCAL_LENGTH_PX = 800.0;

  // Calculates Altitude live using the Pinhole Geometry formula
  // Altitude = (REAL_AIRCRAFT_SIZE_M * FOCAL_LENGTH_PX) / w_px
  const calculatedAltitude = Math.round((activeAircraft.wingspan * FOCAL_LENGTH_PX) / (boxWidth / 10));

  // Animates the sweep lines and coordinates
  useEffect(() => {
    if (!isFeedActive) return;

    const interval = setInterval(() => {
      // Fluctuate bounding box width to simulate real camera pixel changes
      setBoxWidth((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const next = prev + delta;
        return Math.max(160, Math.min(320, next));
      });

      // Fluctuate CLIP confidence score
      setConfidence((prev) => {
        const delta = (Math.random() * 0.4) - 0.2;
        const next = prev + delta;
        return parseFloat(Math.min(99.8, Math.max(88.0, next)).toFixed(1));
      });

      // Update Target Reticle positions slightly
      setTargetPos((prev) => ({
        x: Math.max(15, Math.min(75, prev.x + (Math.random() * 4 - 2))),
        y: Math.max(15, Math.min(65, prev.y + (Math.random() * 4 - 2))),
      }));

      // Adjust heading bearing
      setBearing((prev) => (prev + (Math.random() > 0.5 ? 1 : -1) + 360) % 360);
    }, 400);

    return () => clearInterval(interval);
  }, [isFeedActive]);

  // Rotates aircraft targets every 8 seconds
  useEffect(() => {
    if (!isFeedActive) return;

    const interval = setInterval(() => {
      const idx = (AIRCRAFT_DATABASE.indexOf(activeAircraft) + 1) % AIRCRAFT_DATABASE.length;
      const nextAircraft = AIRCRAFT_DATABASE[idx];
      setActiveAircraft(nextAircraft);

      // Log threat detection
      const newLog = `[${new Date().toLocaleTimeString()}] LOCK ACQUIRED: ${nextAircraft.code} | Class: CLIP_STAGE2 | Conf: ${confidence}%`;
      setTerminalLogs((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isFeedActive, activeAircraft, confidence]);

  // Viewport sweep scan-line animation
  useEffect(() => {
    if (!isFeedActive) return;

    let dir = 1;
    const interval = setInterval(() => {
      setScanLineY((prev) => {
        if (prev >= 100) dir = -1;
        if (prev <= 0) dir = 1;
        return prev + dir * 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isFeedActive]);

  // Initial Threat Log
  useEffect(() => {
    setTerminalLogs([
      `[${new Date().toLocaleTimeString()}] YOLOv11l: Engine loaded successfully (CUDA:0)`,
      `[${new Date().toLocaleTimeString()}] CLIP: openai/clip-vit-base-patch32 initialized`,
      `[${new Date().toLocaleTimeString()}] Target locking parameters set. Ready.`,
    ]);
  }, []);

  const handleToggleFeed = () => {
    const nextState = !isFeedActive;
    setIsFeedActive(nextState);
    const time = new Date().toLocaleTimeString();
    if (nextState) {
      setTerminalLogs((prev) => [`[${time}] SYSTEM RESUMED: Feed active`, ...prev]);
    } else {
      setTerminalLogs((prev) => [`[${time}] SYSTEM SUSPENDED: Radar feed offline`, ...prev]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Target Viewport HUD */}
      <View style={styles.viewport}>
        {/* Holographic Radar Coordinates Grid */}
        <View style={styles.gridOverlay}>
          <View style={styles.crosshairH} />
          <View style={styles.crosshairV} />
          <Text style={styles.focalIndicator}>FOCAL: {FOCAL_LENGTH_PX}px</Text>
          <Text style={styles.fpsText}>{isFeedActive ? '60 FPS' : '0 FPS'}</Text>
        </View>

        {/* Bounding box reticle wrapper */}
        {isFeedActive ? (
          <View
            style={[
              styles.targetBox,
              {
                width: boxWidth / 1.5,
                height: boxWidth / 1.8,
                left: `${targetPos.x}%`,
                top: `${targetPos.y}%`,
              },
            ]}
          >
            {/* Corner Bracket Reticles */}
            <View style={[styles.cornerBracket, styles.bracketTL]} />
            <View style={[styles.cornerBracket, styles.bracketTR]} />
            <View style={[styles.cornerBracket, styles.bracketBL]} />
            <View style={[styles.cornerBracket, styles.bracketBR]} />

            {/* Target telemetry tags */}
            <Text style={styles.targetLabel}>{activeAircraft.code}</Text>
            <Text style={styles.targetAlt}>W: {Math.round(boxWidth)}px</Text>
          </View>
        ) : (
          <View style={styles.offlineOverlay}>
            <Feather name="slash" size={32} color="#FF5F56" />
            <Text style={styles.offlineText}>RADAR SCANNER SUSPENDED</Text>
          </View>
        )}

        {/* Sweep scanner line */}
        {isFeedActive && <View style={[styles.scanLine, { top: `${scanLineY}%` }]} />}

        {/* Viewport Tech overlay borders */}
        <View style={styles.borderCornerTL} />
        <View style={styles.borderCornerTR} />
        <View style={styles.borderCornerBL} />
        <View style={styles.borderCornerBR} />

        <View style={styles.viewportStatusRow}>
          <View style={[styles.pulseDot, { backgroundColor: isFeedActive ? '#00E5FF' : '#FF5F56' }]} />
          <Text style={styles.statusText}>{isFeedActive ? 'TRACKING_ACTIVE' : 'FEED_SUSPENDED'}</Text>
        </View>
      </View>

      {/* Control Plane Action Bar */}
      <View style={styles.actionPanel}>
        <TouchableOpacity
          style={[styles.actionBtn, isFeedActive ? styles.btnDanger : styles.btnActive]}
          onPress={handleToggleFeed}
        >
          <Feather name={isFeedActive ? 'square' : 'play'} size={14} color="#FFF" />
          <Text style={styles.actionBtnText}>
            {isFeedActive ? 'TERMINATE SCANNER' : 'ACTIVATE RADAR'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Core ML Telemetry Dashboard */}
      <View style={styles.telemetryBoard}>
        {/* Row 1: Target Designation */}
        <View style={styles.telemCardFull}>
          <Text style={styles.telemCardLabel}>ZERO-SHOT CLASSIFIER MATCH (CLIP)</Text>
          <Text style={styles.telemCardValue}>{isFeedActive ? activeAircraft.clipLabel : '--'}</Text>
        </View>

        {/* Row 2: Mathematical Pinhole Telemetry */}
        <View style={styles.telemRow}>
          <View style={styles.telemCard}>
            <Text style={styles.telemCardLabel}>ALTITUDE (PINHOLE MATH)</Text>
            <Text style={[styles.telemCardValue, styles.highlightValue]}>
              {isFeedActive ? `${calculatedAltitude.toLocaleString()} m` : '--'}
            </Text>
            <Text style={styles.mathEquation}>A = (w_m * f_px) / box_w_px</Text>
          </View>

          <View style={styles.telemCard}>
            <Text style={styles.telemCardLabel}>CLIP MATCH STRENGTH</Text>
            <Text style={[styles.telemCardValue, { color: '#00E5FF' }]}>
              {isFeedActive ? `${confidence}%` : '--'}
            </Text>
            <Text style={styles.mathEquation}>Stage-2 CLIP confidence</Text>
          </View>
        </View>

        {/* Row 3: Physical Dynamics */}
        <View style={styles.telemRow}>
          <View style={styles.telemCard}>
            <Text style={styles.telemCardLabel}>TARGET BEARING / SPEED</Text>
            <Text style={styles.telemCardValue}>
              {isFeedActive ? `${bearing}° / ${activeAircraft.baseSpeed} kts` : '--'}
            </Text>
          </View>
          <View style={styles.telemCard}>
            <Text style={styles.telemCardLabel}>EST. WINGSPAN SIZE</Text>
            <Text style={styles.telemCardValue}>
              {isFeedActive ? `${activeAircraft.wingspan} meters` : '--'}
            </Text>
          </View>
        </View>
      </View>

      {/* Cyberpunk Terminal Threat Logs console */}
      <View style={styles.consoleContainer}>
        <View style={styles.consoleHeader}>
          <View style={styles.consoleHeaderDots}>
            <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
            <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
            <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
          </View>
          <Text style={styles.consoleTitle}>wingid_radar_stream.sh</Text>
        </View>

        <View style={styles.consoleBody}>
          {terminalLogs.map((log, idx) => (
            <Text key={idx} style={styles.consoleLine} numberOfLines={1} ellipsizeMode="tail">
              {log}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'android' ? 60 : 30,
  },

  // Viewport Styling
  viewport: {
    width: '100%',
    height: 220,
    backgroundColor: '#07070A',
    borderWidth: 1,
    borderColor: '#00E5FF25',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.md,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: '90%',
    height: 1,
    backgroundColor: '#00E5FF10',
  },
  crosshairV: {
    position: 'absolute',
    height: '80%',
    width: 1,
    backgroundColor: '#00E5FF10',
  },
  focalIndicator: {
    position: 'absolute',
    top: 10,
    left: 12,
    color: '#00E5FF50',
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fpsText: {
    position: 'absolute',
    top: 10,
    right: 12,
    color: '#00E5FF80',
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightBold,
  },

  // Target Box Reticles
  targetBox: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: '#00E5FF50',
    backgroundColor: '#00E5FF05',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerBracket: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderColor: '#00E5FF',
  },
  bracketTL: {
    top: -2,
    left: -2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  bracketTR: {
    top: -2,
    right: -2,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bracketBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bracketBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  targetLabel: {
    color: '#00E5FF',
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#07070AC0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    position: 'absolute',
    top: -14,
    left: 2,
  },
  targetAlt: {
    color: '#00E5FFB0',
    fontSize: 7,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    position: 'absolute',
    bottom: -12,
    left: 2,
  },

  // Offline view
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#07070AE0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: '#FF5F56',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    marginTop: SPACING.sm,
  },

  // Scanline Effect
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00E5FF40',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },

  // Cyber corners
  borderCornerTL: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 10,
    height: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#00E5FF40',
  },
  borderCornerTR: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#00E5FF40',
  },
  borderCornerBL: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 10,
    height: 10,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#00E5FF40',
  },
  borderCornerBR: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 10,
    height: 10,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#00E5FF40',
  },
  viewportStatusRow: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07070AC0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    color: COLORS.textPrimary,
    fontSize: 7.5,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },

  // Action Panel
  actionPanel: {
    marginBottom: SPACING.md,
  },
  actionBtn: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  btnDanger: {
    backgroundColor: 'rgba(255, 95, 86, 0.08)',
    borderColor: 'rgba(255, 95, 86, 0.2)',
  },
  btnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    marginLeft: SPACING.sm,
  },

  // Telemetry Dashboard
  telemetryBoard: {
    marginBottom: SPACING.md,
  },
  telemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  telemCardFull: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: SPACING.sm,
  },
  telemCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    width: '48.5%',
  },
  telemCardLabel: {
    color: COLORS.textSecondary,
    fontSize: 7.5,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  telemCardValue: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: FONTS.weightBold,
  },
  highlightValue: {
    color: '#FFD700', // Gold highlighting for primary math outcome
  },
  mathEquation: {
    color: COLORS.textSecondary,
    fontSize: 7.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 4,
  },

  // Terminal Console
  consoleContainer: {
    backgroundColor: '#070709',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  consoleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f13',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  consoleHeaderDots: {
    flexDirection: 'row',
    marginRight: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  consoleTitle: {
    color: COLORS.textSecondary,
    fontSize: 8.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightSemiBold,
  },
  consoleBody: {
    padding: 12,
    minHeight: 90,
  },
  consoleLine: {
    color: 'rgba(0, 229, 255, 0.75)',
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 14,
    marginBottom: 3,
  },
});
