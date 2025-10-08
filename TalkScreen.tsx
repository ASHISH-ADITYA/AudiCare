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
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
};

export default function TalkScreen({ visible, onClose, apiKey }: { visible: boolean; onClose: () => void; apiKey: string; }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', role: 'assistant', text: 'Hi — I am AudiCare AI Assistant. Ask me about your health concerns, symptoms, or general health questions. You can type or use voice input!' },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    // Setup voice recognition
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value[0]) {
        setInput(e.value[0]);
        setIsListening(false);
      }
    };
    Voice.onSpeechError = (e) => {
      console.log('Speech error:', e);
      setIsListening(false);
      Alert.alert('Voice Error', 'Failed to recognize speech. Please try again.');
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US');
    } catch (e) {
      console.error('Failed to start voice recognition:', e);
      setIsListening(false);
      Alert.alert('Voice Error', 'Failed to start voice recognition. Please check permissions.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Failed to stop voice recognition:', e);
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(text, {
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { id: String(Date.now()), role: 'user', text };
    setMessages((m) => [...m, userMessage]);
    setInput('');

    // Enhanced health-focused chatbot responses
    const getHealthResponse = (userText: string): string => {
      const lowerText = userText.toLowerCase();
      
      // Health-related responses
      if (lowerText.includes('headache') || lowerText.includes('head pain')) {
        return "For headaches, try resting in a quiet, dark room. Stay hydrated and consider gentle neck stretches. If headaches are severe, frequent, or accompanied by fever, vision changes, or neck stiffness, please consult a healthcare provider immediately.";
      }
      
      if (lowerText.includes('fever') || lowerText.includes('temperature')) {
        return "For fever, rest and stay hydrated with water, clear broths, or electrolyte drinks. You can use over-the-counter fever reducers as directed. Seek immediate medical attention if fever exceeds 103°F (39.4°C), or if you experience difficulty breathing, chest pain, or severe symptoms.";
      }
      
      if (lowerText.includes('cough') || lowerText.includes('sore throat')) {
        return "For cough and sore throat, try warm salt water gargles, honey (for ages 1+), and staying hydrated. Use a humidifier if possible. See a doctor if symptoms persist over a week, you have difficulty swallowing, or experience high fever.";
      }
      
      if (lowerText.includes('stomach') || lowerText.includes('nausea') || lowerText.includes('vomit')) {
        return "For stomach issues, try the BRAT diet (bananas, rice, applesauce, toast), stay hydrated with small sips of clear fluids. Avoid dairy and fatty foods. Seek medical care if you have severe abdominal pain, signs of dehydration, or persistent vomiting.";
      }
      
      if (lowerText.includes('emergency') || lowerText.includes('urgent') || lowerText.includes('911')) {
        return "🚨 If this is a medical emergency, please call 911 or go to the nearest emergency room immediately. For chest pain, difficulty breathing, severe allergic reactions, or loss of consciousness, seek immediate medical attention.";
      }
      
      if (lowerText.includes('medication') || lowerText.includes('medicine') || lowerText.includes('drug')) {
        return "I can provide general information about health topics, but I cannot recommend specific medications or dosages. Please consult with a healthcare provider, pharmacist, or your doctor for medication advice tailored to your specific situation.";
      }
      
      if (lowerText.includes('diet') || lowerText.includes('nutrition') || lowerText.includes('food')) {
        return "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated, limit processed foods and excessive sugar. For personalized nutrition advice, consider consulting a registered dietitian.";
      }
      
      if (lowerText.includes('exercise') || lowerText.includes('workout') || lowerText.includes('fitness')) {
        return "Regular exercise is great for health! Aim for 150 minutes of moderate aerobic activity weekly, plus strength training twice a week. Start slowly if you're new to exercise and consult your doctor before beginning any new fitness program.";
      }
      
      if (lowerText.includes('sleep') || lowerText.includes('insomnia') || lowerText.includes('tired')) {
        return "Good sleep hygiene includes a consistent sleep schedule, a comfortable sleep environment, avoiding screens before bed, and limiting caffeine late in the day. Most adults need 7-9 hours of sleep. If sleep problems persist, consider consulting a healthcare provider.";
      }
      
      if (lowerText.includes('stress') || lowerText.includes('anxiety') || lowerText.includes('mental health')) {
        return "Managing stress is important for overall health. Try deep breathing, meditation, regular exercise, and maintaining social connections. If you're experiencing persistent anxiety or mental health concerns, please reach out to a mental health professional.";
      }
      
      // General health questions
      if (lowerText.includes('doctor') || lowerText.includes('appointment')) {
        return "It's always good to maintain regular check-ups with your healthcare provider. If you have specific health concerns, don't hesitate to schedule an appointment. Many symptoms warrant professional medical evaluation.";
      }
      
      // Default health-focused response
      return `I understand you're asking about "${text}". While I can provide general health information, I recommend consulting with a healthcare professional for personalized medical advice. Is there a specific health topic I can help you learn more about?`;
    };

    // If there's no API key, use our health-focused responses
    if (!apiKey) {
      setTimeout(() => {
        const response = getHealthResponse(text);
        const assistantMessage: Message = { id: String(Date.now() + 1), role: 'assistant', text: response };
        setMessages((m) => [...m, assistantMessage]);
        
        // Auto-speak the response
        speakText(response);
      }, 700);
      return;
    }

    try {
      // Use OpenAI API or similar service
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are AudiCare AI, a helpful health assistant. Provide helpful, general health information but always remind users to consult healthcare professionals for medical advice. Be empathetic and supportive.'
            },
            { role: 'user', content: text }
          ],
          max_tokens: 150,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const data = await res.json();
      const assistantText = data?.choices?.[0]?.message?.content || getHealthResponse(text);
      const assistantMessage: Message = { id: String(Date.now() + 1), role: 'assistant', text: assistantText };
      setMessages((m) => [...m, assistantMessage]);
      
      // Auto-speak the response
      speakText(assistantText);
    } catch (e) {
      const fallbackResponse = getHealthResponse(text);
      setMessages((m) => [...m, { id: String(Date.now() + 1), role: 'assistant', text: fallbackResponse }]);
      speakText(fallbackResponse);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.title}>AudiCare AI Assistant</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messages} ref={scrollRef} contentContainerStyle={{ padding: 12 }}>
          {messages.map((m) => (
            <View key={m.id} style={[styles.messageBubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={[styles.messageText, m.role === 'user' ? styles.userText : styles.assistantText]}>{m.text}</Text>
              {m.role === 'assistant' && (
                <TouchableOpacity 
                  style={styles.speakBtn} 
                  onPress={() => speakText(m.text)}
                >
                  <Text style={styles.speakBtnText}>{isSpeaking ? '🔇' : '🔊'}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message or use voice..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity 
            style={[styles.voiceBtn, isListening && styles.voiceBtnActive]} 
            onPress={isListening ? stopListening : startListening}
          >
            <Text style={styles.voiceBtnText}>{isListening ? '🛑' : '🎤'}</Text>
          </TouchableOpacity>
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
  input: { flex: 1, minHeight: 40, maxHeight: 120, padding: 10, backgroundColor: '#f6f6f6', borderRadius: 8, marginRight: 8 },
  voiceBtn: { 
    backgroundColor: '#3498db', 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    justifyContent: 'center',
    marginRight: 8,
  },
  voiceBtnActive: { 
    backgroundColor: '#e74c3c',
  },
  voiceBtnText: { 
    fontSize: 18,
  },
  sendBtn: { backgroundColor: '#1abc9c', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, justifyContent: 'center' },
  sendText: { color: 'white', fontWeight: '700' },
  messageBubble: { 
    marginVertical: 6, 
    padding: 12, 
    borderRadius: 12, 
    maxWidth: '85%',
    position: 'relative',
  },
  userBubble: { backgroundColor: '#1abc9c', alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: '#f1f1f1', alignSelf: 'flex-start' },
  messageText: { color: '#222', lineHeight: 20 },
  userText: { color: 'white' },
  assistantText: { color: '#222' },
  speakBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 4,
  },
  speakBtnText: {
    fontSize: 12,
  },
});
