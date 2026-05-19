import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '../styles/theme';

export default function Limitless() {
  const [inputText, setInputText] = useState('');
  
  // Simulated RAG Chat History
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'user',
      text: 'Summarize the core mechanism described in the bitcoin whitepaper.',
      time: '15:01',
    },
    {
      id: '2',
      sender: 'ai',
      text: 'The Bitcoin whitepaper by Satoshi Nakamoto proposes a peer-to-peer electronic cash system. The core mechanism is a decentralized ledger built on a proof-of-work chain. Transactions are hashed into blocks, and nodes expend CPU power to satisfy a cryptographic puzzle (hash starting with zero bits).\n\nThis creates an immutable chain where the longest chain serves as proof of the sequence of events.',
      time: '15:01',
      citations: [
        { id: 'c1', doc: 'bitcoin_whitepaper.pdf', page: 3, label: 'Proof-of-Work' },
        { id: 'c2', doc: 'bitcoin_whitepaper.pdf', page: 2, label: 'Transactions' }
      ]
    },
    {
      id: '3',
      sender: 'user',
      text: 'How does it handle the double-spending problem?',
      time: '15:05',
    },
    {
      id: '4',
      sender: 'ai',
      text: 'Double-spending is prevented using a timestamp server and the proof-of-work network. When a transaction is broadcast, it must be included in a block. The network accepts the first received block containing the transaction, discarding subsequent blocks containing conflicting transactions (the double-spend attempt).',
      time: '15:05',
      citations: [
        { id: 'c3', doc: 'bitcoin_whitepaper.pdf', page: 2, label: 'Timestamp Server' }
      ]
    }
  ]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="layers" size={18} color={COLORS.textPrimary} />
          <Text style={styles.headerTitle}>Limitless</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.agentBadge}>
            <Text style={styles.agentBadgeText}>AGENT MODE</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="more-horizontal" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat History */}
      <ScrollView 
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessage}>documind index active • 384-dim cosine</Text>
        </View>

        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageRow,
              msg.sender === 'user' ? styles.messageRowUser : styles.messageRowAi
            ]}
          >
            {/* AI Avatar */}
            {msg.sender === 'ai' && (
              <View style={styles.aiAvatar}>
                <MaterialCommunityIcons name="brain" size={12} color="#E040FB" />
              </View>
            )}

            <View 
              style={[
                styles.bubble,
                msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  msg.sender === 'user' ? styles.messageTextUser : styles.messageTextAi
                ]}
              >
                {msg.text}
              </Text>

              {/* Citations block for AI messages */}
              {msg.citations && (
                <View style={styles.citationsContainer}>
                  {msg.citations.map(cite => (
                    <TouchableOpacity key={cite.id} style={styles.citationChip}>
                      <Feather name="file-text" size={10} color="#E040FB" />
                      <Text style={styles.citationText}>
                        {cite.doc} • pg. {cite.page}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text 
                style={[
                  styles.timeText,
                  msg.sender === 'user' ? styles.timeTextUser : styles.timeTextAi
                ]}
              >
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachBtn}>
            <Feather name="paperclip" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter a message..."
            placeholderTextColor={COLORS.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Feather name="send" size={18} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: FONTS.weightBold,
    marginLeft: SPACING.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentBadge: {
    backgroundColor: 'rgba(224, 64, 251, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(224, 64, 251, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: SPACING.sm,
  },
  agentBadgeText: {
    color: '#E040FB',
    fontSize: 8,
    fontWeight: FONTS.weightBold,
  },
  headerIcon: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  systemMessage: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: FONTS.weightSemiBold,
    letterSpacing: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    width: '100%',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  aiAvatar: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'rgba(224, 64, 251, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(224, 64, 251, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: '#1E1E24',
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: '#EBEBF0', // Light grey from the reference
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  messageTextUser: {
    color: COLORS.textPrimary,
  },
  messageTextAi: {
    color: '#000000',
    fontWeight: '500',
  },
  citationsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  citationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  citationText: {
    fontSize: 9,
    color: '#333',
    fontWeight: '600',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 9,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  timeTextUser: {
    color: COLORS.textSecondary,
  },
  timeTextAi: {
    color: '#666',
  },
  inputContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: Platform.OS === 'android' ? 24 : SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131316',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    minHeight: 44,
    paddingHorizontal: SPACING.sm,
  },
  attachBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    paddingHorizontal: SPACING.sm,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
  },
  sendBtn: {
    padding: 8,
  },
});
