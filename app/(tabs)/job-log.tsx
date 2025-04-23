import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function JobLogScreen() {
  const [note, setNote] = useState('');
  const router = useRouter();

  const handleGenerate = () => {
    router.push({
      pathname: '/output',
      params: { input: note, type: 'job' }
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter Job Summary:</Text>
      <TextInput
        placeholder="e.g., Replaced breaker in kitchen panel"
        multiline
        value={note}
        onChangeText={setNote}
        style={{ height: 120, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Generate Log" onPress={handleGenerate} />
    </View>
  );
} 