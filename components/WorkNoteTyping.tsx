import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const fullText = "WorkNote";

export default function WorkNoteTyping() {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const startTyping = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/pencil-writing-sound.mp3')
        );
        setSound(sound);
        await sound.playAsync();

        interval = setInterval(() => {
          if (index < fullText.length) {
            setDisplayed((prev) => prev + fullText[index]);
            setIndex((prev) => prev + 1);
          } else {
            clearInterval(interval);
          }
        }, 180);
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    };

    startTyping();

    return () => {
      clearInterval(interval);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [index]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {displayed}
      </Text>

      {index < fullText.length && (
        <MaterialCommunityIcons
          name="pencil"
          size={28}
          color="#2A5F9E"
          style={styles.pencil}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minWidth: 280,
  },
  text: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 40,
    color: '#2A5F9E',
    includeFontPadding: false,
  },
  pencil: {
    marginLeft: 6,
  },
}); 