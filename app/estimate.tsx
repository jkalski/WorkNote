import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

export default function Estimate() {
  const [note, setNote] = useState('');
  const router = useRouter();

  const handleGenerate = () => {
    if (!note.trim()) return;
    router.push({ pathname: '/output', params: { input: note, type: 'estimate' } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Stack.Screen options={{ title: 'Create Estimate' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Description Box */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>Estimate work clearly</Text>
          <Text style={styles.descriptionText}>
            Provide a quick breakdown of expected labor time, hourly rates, materials, or project scope.
            WorkNote will format it into a professional-looking estimate you can copy, send, or save.
          </Text>
        </View>

        {/* Input */}
        <Text style={styles.title}>Estimate Details</Text>
        <TextInput
          placeholder="e.g., Install light fixture, 2.5 hrs @ $85/hr, $35 in parts"
          multiline
          value={note}
          onChangeText={setNote}
          style={styles.input}
          placeholderTextColor="#999"
        />

        {/* Styled Button */}
        <TouchableOpacity
          style={[styles.button, !note.trim() && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={!note.trim()}
        >
          <Text style={styles.buttonText}>Generate Estimate</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
  },
  descriptionBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A5F9E',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A5F9E',
    marginBottom: 10,
  },
  input: {
    minHeight: 140,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  button: {
    backgroundColor: '#2A5F9E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0B8D8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 