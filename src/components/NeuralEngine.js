import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../styles/theme';

export default function NeuralEngine() {
  const [logs, setLogs] = useState([]);
  const [activeDots, setActiveDots] = useState('...');

  const mockLogs = [
    'Initializing local OMEN host connection...',
    'Establishing secure loopback at omen://device_11r...',
    'CUDA Toolkit binding initialized (v12.8)...',
    'Blackwell SM_12.0 Core detected. Compute mapping validated.',
    'Loading local neural weight parameters...',
    'Fetching Llama-3-8B-Instruct local GGUF quants (Q4_K_M)...',
    'Allocating VRAM (target: 3.8 GB) on secondary thread...',
    'Tokenizing lexicon map (128k vocabulary)...',
    'Pinecone indexing vector pipeline online.',
    'Establishing dual-mode RAG client sockets...',
    'Awaiting LLM integration. Core shield ACTIVE.',
  ];

  // Simulates an active terminal compilation feed
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < mockLogs.length) {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${mockLogs[index]}`]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Animates the loading text dots
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Premium HUD Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Feather name="aperture" size={18} color="#E040FB" />
          <Text style={styles.headerTitle}>NEURAL ENGINE</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PORTING TO EDGE</Text>
        </View>
      </View>

      {/* Cybernetic Glowing Core Panel */}
      <View style={styles.corePanel}>
        <View style={styles.coreOrbWrapper}>
          {/* Main glowing concentric ring */}
          <View style={styles.glowingRingOuter}>
            <View style={styles.glowingRingInner}>
              <MaterialCommunityIcons name="brain" size={36} color="#E040FB" style={styles.coreBrainIcon} />
            </View>
          </View>
        </View>

        <Text style={styles.coreStatusText}>LLM SANDBOX {activeDots}</Text>
        <Text style={styles.coreSubText}>Offline for Local quantized model binding</Text>
      </View>

      {/* Terminal Compiler Logs console */}
      <View style={styles.consoleContainer}>
        <View style={styles.consoleHeader}>
          <View style={styles.consoleHeaderDots}>
            <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
            <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
            <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
          </View>
          <Text style={styles.consoleTitle}>omen_compilation.log</Text>
        </View>

        <ScrollView style={styles.consoleBody} contentContainerStyle={styles.consoleContent} showsVerticalScrollIndicator={false}>
          {logs.map((log, idx) => (
            <Text key={idx} style={styles.consoleLine}>
              {log}
            </Text>
          ))}
          {logs.length < mockLogs.length && (
            <View style={styles.loadingLineRow}>
              <ActivityIndicator size="small" color="#E040FB" style={styles.compilingIndicator} />
              <Text style={[styles.consoleLine, { color: '#E040FB', marginLeft: 6 }]}>Compiling compiler instructions...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
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
    marginTop: Platform.OS === 'ios' ? SPACING.xs : SPACING.sm,
    marginBottom: SPACING.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: FONTS.weightBold,
    letterSpacing: 2,
    marginLeft: SPACING.sm,
  },
  badge: {
    backgroundColor: 'rgba(224, 64, 251, 0.08)',
    borderColor: 'rgba(224, 64, 251, 0.15)',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#E040FB',
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.8,
  },

  // Glowing Core Panel
  corePanel: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  coreOrbWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  glowingRingOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(224, 64, 251, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(224, 64, 251, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    // Dynamic glow shadows
    shadowColor: '#E040FB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  glowingRingInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#121217',
    borderWidth: 2,
    borderColor: '#E040FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coreBrainIcon: {
    // Subtle offset for alignment
    marginTop: 1,
  },
  coreStatusText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
  },
  coreSubText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },

  // Terminal Console
  consoleContainer: {
    flex: 1,
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
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  consoleTitle: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightSemiBold,
  },
  consoleBody: {
    flex: 1,
    padding: 12,
  },
  consoleContent: {
    paddingBottom: 24,
  },
  consoleLine: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 15,
    marginBottom: 4,
  },
  loadingLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  compilingIndicator: {
    transform: [{ scale: 0.7 }],
  },
});
