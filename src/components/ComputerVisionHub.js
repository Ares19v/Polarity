import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';

// We import the sub-components to render inside the hub
import Blink from './Blink';
import PCBScanner from './PCBScanner';
import WingID from './WingID';

export default function ComputerVisionHub({ activeTab, onTabChange }) {
  const { theme } = useTheme();

  // Database of Computer Vision Node Cards
  const CV_PROJECTS = [
    {
      id: 'blink',
      title: 'Blink',
      subtitle: 'Fatigue Monitor',
      icon: 'eye',
      iconType: 'feather',
      color: theme.accentSecondary,
      status: '[ONLINE]',
      progress: 0.28,
    },
    {
      id: 'inspection_engine',
      title: 'Inspection Engine',
      subtitle: 'Industrial PCB Defect Scanner',
      icon: 'memory',
      iconType: 'material',
      color: theme.accent,
      status: '[ONLINE]',
      progress: 0.85,
    },
    {
      id: 'wing_id',
      title: 'WingID',
      subtitle: 'Tactical UAV Altitude Math',
      icon: 'airplane',
      iconType: 'material',
      color: theme.accentSecondary,
      status: '[ONLINE]',
      progress: 0.65,
    },
  ];

  // Render the Selection Dashboard Hub
  if (activeTab === 'hub') {
    return (
      <View style={[styles.hubContainer, { backgroundColor: theme.background }]}>
        {/* Futuristic Hub Header */}
        <View style={styles.hubHeader}>
          <View>
            <Text style={[styles.hubTitle, { color: theme.textPrimary }]}>ACTIVE NODES</Text>
            <Text style={[styles.hubSubtitle, { color: theme.textSecondary }]}>Select an edge module to interface</Text>
          </View>
          <View style={[styles.activePulseRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.activePulse, { backgroundColor: theme.accent }]} />
            <Text style={[styles.activePulseText, { color: theme.accent }]}>3 DEPLOYED</Text>
          </View>
        </View>

        {/* Scrollable Card-Box Grid */}
        <ScrollView style={styles.scrollGrid} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollGridContent}>
          <View style={styles.cardGrid}>
            {CV_PROJECTS.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  styles.projectCard, 
                  { 
                    backgroundColor: theme.surface, 
                    borderColor: theme.border,
                    shadowColor: theme.glow,
                    shadowOpacity: theme.mode === 'cyberpunk' ? 0.3 : 0,
                    shadowRadius: 10,
                  }
                ]}
                onPress={() => onTabChange(project.id)}
              >
                {/* Top Row */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconCircle, { backgroundColor: `${project.color}08`, borderColor: theme.border }]}>
                    {project.iconType === 'feather' ? (
                      <Feather name={project.icon} size={14} color={project.color} />
                    ) : (
                      <MaterialCommunityIcons name={project.icon} size={14} color={project.color} />
                    )}
                  </View>
                  <TouchableOpacity style={styles.settingsAccessory}>
                    <Feather name="sliders" size={11} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Middle Row: Custom visual graphics */}
                <View style={styles.cardVisualArea}>
                  {project.id === 'blink' && (
                    <View style={styles.visualProgressWrapper}>
                      <View style={[styles.visualRingOuter, { borderColor: `${project.color}25` }]}>
                        <View style={[styles.visualRingIndicator, { borderTopColor: project.color }]} />
                        <Text style={[styles.visualCenterText, { color: project.color }]}>EAR</Text>
                      </View>
                    </View>
                  )}
                  
                  {project.id === 'inspection_engine' && (
                    <View style={styles.visualGridWrapper}>
                      <View style={[styles.gridBlock, { borderColor: `${project.color}25` }]}>
                        <View style={[styles.gridInnerBox, { backgroundColor: `${project.color}10` }]} />
                        <View style={[styles.gridScanBar, { backgroundColor: project.color }]} />
                      </View>
                    </View>
                  )}

                  {project.id === 'wing_id' && (
                    <View style={styles.visualRadarWrapper}>
                      <View style={[styles.radarCircle, { borderColor: `${project.color}25` }]}>
                        <View style={[styles.radarSweep, { borderRightColor: project.color }]} />
                        <Feather name="crosshair" size={12} color={project.color} />
                      </View>
                    </View>
                  )}
                </View>

                {/* Bottom Row */}
                <View style={styles.cardTextRow}>
                  <Text style={[styles.projectTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                    {project.title}
                  </Text>
                  <Text style={[styles.projectStatus, { color: project.color }]} numberOfLines={1}>
                    {project.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render Inner Screens with the Control Panel Header
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back Navigation Bar */}
      <View style={[styles.backHeaderBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onTabChange('hub')}>
          <Feather name="chevron-left" size={16} color={theme.textPrimary} />
          <Text style={[styles.backBtnText, { color: theme.textPrimary }]}>BACK TO HUB</Text>
        </TouchableOpacity>
        <View style={[styles.activeProjectTag, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <View style={[styles.telemPulse, { backgroundColor: activeTab === 'blink' ? theme.accentSecondary : theme.accent }]} />
          <Text style={[styles.activeProjectText, { color: theme.textSecondary }]}>
            {activeTab === 'blink' ? 'BLINK' : activeTab === 'wing_id' ? 'WINGID' : 'INSPECTION_ENGINE'}
          </Text>
        </View>
      </View>

      {/* Local Deploy Control Panel */}
      <View style={[styles.deployPanel, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={[styles.deployBtn, { backgroundColor: `${theme.accent}15`, borderColor: theme.accent }]}>
          <Feather name="play-circle" size={12} color={theme.accent} />
          <Text style={[styles.deployBtnText, { color: theme.accent }]}>DEPLOY NODE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deployBtn, { backgroundColor: `${theme.textSecondary}10`, borderColor: theme.border, marginLeft: SPACING.sm }]}>
          <Feather name="refresh-cw" size={12} color={theme.textPrimary} />
          <Text style={[styles.deployBtnText, { color: theme.textPrimary }]}>SYNC & DEPLOY</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <Feather name="shield" size={14} color={theme.accent} style={{ opacity: 0.8 }} />
      </View>

      {/* Embedded Sub-Screen Container */}
      <View style={styles.contentArea}>
        {activeTab === 'blink' && <Blink />}
        {activeTab === 'inspection_engine' && <PCBScanner />}
        {activeTab === 'wing_id' && <WingID />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hubContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? SPACING.xs : SPACING.sm,
    marginBottom: SPACING.lg,
  },
  hubTitle: {
    fontSize: 13,
    fontWeight: FONTS.weightBold,
    letterSpacing: 2,
  },
  hubSubtitle: {
    fontSize: 9.5,
    marginTop: 2,
  },
  activePulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  activePulseText: {
    fontSize: 7.5,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
  },
  scrollGrid: {
    flex: 1,
  },
  scrollGridContent: {
    paddingBottom: Platform.OS === 'android' ? 60 : 30,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  projectCard: {
    width: '48.2%',
    height: 156,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: SPACING.md,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  settingsAccessory: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardVisualArea: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  visualProgressWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualRingOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  visualRingIndicator: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  visualCenterText: {
    fontSize: 7.5,
    fontWeight: FONTS.weightBold,
    letterSpacing: 0.5,
  },
  visualGridWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBlock: {
    width: 50,
    height: 34,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridInnerBox: {
    width: 32,
    height: 20,
    borderRadius: 2,
  },
  gridScanBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    height: 1.5,
  },
  visualRadarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  radarSweep: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'transparent',
    transform: [{ rotate: '-60deg' }],
  },
  cardTextRow: {
    marginTop: 2,
  },
  projectTitle: {
    fontSize: 10.5,
    fontWeight: FONTS.weightBold,
  },
  projectStatus: {
    fontSize: 8.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightBold,
    marginTop: 2,
  },
  backHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? SPACING.xs : SPACING.sm,
    paddingBottom: SPACING.sm,
    height: 52,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingRight: 16,
  },
  backBtnText: {
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  activeProjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  telemPulse: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  activeProjectText: {
    fontSize: 7.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: FONTS.weightBold,
  },
  deployPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  deployBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  deployBtnText: {
    fontSize: 8,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginLeft: 6,
  },
  contentArea: {
    flex: 1,
  },
});
