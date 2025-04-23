import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to WorkNote</Text>

      <Link href="/job-log" asChild>
        <Button title="Create Job Log" />
      </Link>

      <Link href="/estimate" asChild>
        <Button title="Create Estimate" />
      </Link>
    </View>
  );
}
