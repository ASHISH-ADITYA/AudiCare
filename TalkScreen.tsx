import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
};

export default function TalkScreen({ visible, onClose, apiKey }: { visible: boolean; onClose: () => void; apiKey: string; }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', role: 'assistant', text: 'Hi — I am here to help. Ask me anything.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { id: String(Date.now()), role: 'user', text };
    setMessages((m) => [...m, userMessage]);
    setInput('');

    // If there's no API key, simulate a reply locally so the UI still works.
    if (!apiKey) {
      setTimeout(() => {
        setMessages((m) => [...m, { id: String(Date.now() + 1), role: 'assistant', text: `Simulated reply to: "${text}"` }]);
      }, 700);
      return;
    }

    try {
      // TODO: Replace this URL with the real Genimin/GenMin API endpoint or your backend proxy.
      const res = await fetch('https://api.genimin.example/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-like-model',
          messages: [{ role: 'user', content: text }],
        }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();

      // Adapt this to the real response shape. We'll try common fields.
      const assistantText = data?.choices?.[0]?.message?.content || data?.reply || JSON.stringify(data);
      setMessages((m) => [...m, { id: String(Date.now() + 1), role: 'assistant', text: String(assistantText) }]);
    } catch (e) {
      setMessages((m) => [...m, { id: String(Date.now() + 1), role: 'assistant', text: 'Sorry — I could not reach the talk service right now.' }]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>Talk with Genimin</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messages} ref={scrollRef} contentContainerStyle={{ padding: 12 }}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.messageBubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={styles.messageText}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 64, backgroundColor: '#16a085', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  title: { color: 'white', fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 8 },
  closeText: { color: 'white', fontWeight: '700' },
  messages: { flex: 1 },
  composer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  input: { flex: 1, minHeight: 40, maxHeight: 120, padding: 10, backgroundColor: '#f6f6f6', borderRadius: 8 },
  sendBtn: { marginLeft: 8, backgroundColor: '#1abc9c', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, justifyContent: 'center' },
  sendText: { color: 'white', fontWeight: '700' },
  messageBubble: { marginVertical: 6, padding: 12, borderRadius: 12, maxWidth: '85%' },
  userBubble: { backgroundColor: '#1abc9c', alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start' },
  messageText: { color: '#222' },
});
