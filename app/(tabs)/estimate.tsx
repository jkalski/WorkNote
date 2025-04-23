import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function EstimateScreen() {
  const [note, setNote] = useState('');
  const router = useRouter();

  const handleGenerate = () => {
    router.push({
      pathname: '/output',
      params: { input: note, type: 'estimate' }
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Describe the work + labor + materials:</Text>
      <TextInput
        placeholder="e.g., Install fan, 2 hrs @ $85/hr, $60 fan"
        multiline
        value={note}
        onChangeText={setNote}
        style={{ height: 120, borderColor: 'gray', borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Generate Estimate" onPress={handleGenerate} />
    </View>
  );
} 