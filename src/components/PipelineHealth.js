import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../styles/ThemeContext';

export default function PipelineHealth() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock GitHub Pipeline Data
  const PIPELINES = [
    { id: 1, name: 'Echo', branch: 'main', status: 'passed', time: '12m', commit: 'Refactored audio stream buffers' },
    { id: 2, name: 'Limitless', branch: 'dev', status: 'running', time: '2m', commit: 'Pinecone hybrid search integration' },
    { id: 3, name: 'WingID', branch: 'main', status: 'failed', time: '1h', commit: 'TensorRT bbox parsing fix' },
    { id: 4, name: 'Cryo', branch: 'main', status: 'passed', time: '4h', commit: 'WMI fan control overrides' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header & Global Health Ring */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>LOGISTICS CENTER</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>GitHub API // CI/CD Workflows</Text>
        </View>
        <View style={styles.healthRingOuter}>
          <View style={[styles.healthRingInner, { borderColor: theme.accent }]} />
          <Text style={[styles.healthText, { color: theme.accent }]}>94%</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Feather name="search" size={14} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search active nodes..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Pipeline List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PIPELINES.map((pipe) => (
          <TouchableOpacity 
            key={pipe.id} 
            style={[
              styles.pipelineCard, 
              { 
                backgroundColor: theme.surface, 
                borderColor: pipe.status === 'failed' ? theme.danger : theme.border,
                shadowColor: pipe.status === 'failed' ? theme.danger : theme.glow,
                shadowOpacity: theme.mode === 'cyberpunk' ? (pipe.status === 'failed' ? 0.4 : 0.1) : 0,
                shadowRadius: 8,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.repoInfo}>
                <Feather name="github" size={14} color={theme.textPrimary} />
                <Text style={[styles.repoName, { color: theme.textPrimary }]}>{pipe.name}</Text>
                <View style={[styles.branchTag, { backgroundColor: theme.surfaceSecondary }]}>
                  <Feather name="git-branch" size={10} color={theme.textSecondary} />
                  <Text style={[styles.branchText, { color: theme.textSecondary }]}>{pipe.branch}</Text>
                </View>
              </View>
              <Text style={[styles.timeText, { color: theme.textSecondary }]}>{pipe.time} ago</Text>
            </View>
            
            <Text style={[styles.commitMessage, { color: theme.textSecondary }]} numberOfLines={1}>
              "{pipe.commit}"
            </Text>

            <View style={styles.statusRow}>
              {pipe.status === 'passed' && (
                <View style={[styles.statusBadge, { backgroundColor: `${theme.accent}15` }]}>
                  <Feather name="check-circle" size={12} color={theme.accent} />
                  <Text style={[styles.statusText, { color: theme.accent }]}>PASSED</Text>
                </View>
              )}
              {pipe.status === 'running' && (
                <View style={[styles.statusBadge, { backgroundColor: `${theme.accentSecondary}15` }]}>
                  <Feather name="loader" size={12} color={theme.accentSecondary} />
                  <Text style={[styles.statusText, { color: theme.accentSecondary }]}>BUILDING</Text>
                </View>
              )}
              {pipe.status === 'failed' && (
                <View style={[styles.statusBadge, { backgroundColor: `${theme.danger}15` }]}>
                  <Feather name="x-circle" size={12} color={theme.danger} />
                  <Text style={[styles.statusText, { color: theme.danger }]}>FAILED</Text>
                </View>
              )}
              <Text style={[styles.workflowLink, { color: theme.textSecondary }]}>View logs ↗</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  healthRingOuter: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  healthRingInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 3,
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  healthText: {
    fontSize: 10,
    fontWeight: FONTS.weightBold,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    height: 40,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 11,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 80 : 40,
  },
  pipelineCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  repoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoName: {
    fontSize: 12,
    fontWeight: FONTS.weightBold,
    marginLeft: 6,
  },
  branchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  branchText: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 9,
  },
  commitMessage: {
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: FONTS.weightBold,
    letterSpacing: 1,
    marginLeft: 4,
  },
  workflowLink: {
    fontSize: 9,
    textDecorationLine: 'underline',
  },
});
