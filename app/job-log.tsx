import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

export default function JobLog() {
  const [note, setNote] = useState('');
  const router = useRouter();

  const handleGenerate = () => {
    if (!note.trim()) return;
    router.push({ pathname: '/output', params: { input: note, type: 'job' } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <Stack.Screen options={{ title: 'Create Job Log' }} />

      <Text style={styles.label}>Describe what you did:</Text>
      <TextInput
        placeholder="e.g., Installed GFCI outlet, 2 hours, $85/hr"
        multiline
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />
      <Button title="Generate Log" onPress={handleGenerate} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    height: 140,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
}); 