import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiText, MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import WorkNoteTyping from '../components/WorkNoteTyping';

const screenHeight = Dimensions.get('window').height;

export default function Home() {
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  let [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  useEffect(() => {
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/pencil-writing-sound.mp3')
        );
        setSound(sound);
        // Delay the sound to sync perfectly with the title animation
        setTimeout(async () => {
          await sound.playAsync();
        }, 100);
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    };

    playSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Vertical red margin line */}
      <View style={styles.marginLine} />

      {/* Horizontal lines */}
      {[...Array(Math.floor(screenHeight / 40)).keys()].map((i) => (
        <View key={i} style={[styles.line, { top: i * 40 }]} />
      ))}

      {/* Subtle overlay to tone down the background */}
      <View style={styles.backgroundOverlay} />

      {/* Content overlay */}
      <View style={styles.overlay}>
        {/* Animated WorkNote Title */}
        <View style={styles.titleRow}>
          <WorkNoteTyping />
        </View>

        <MotiText
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1600, duration: 600 }}
          style={styles.subtitle}
        >
          Smart job logging & estimates.
        </MotiText>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 2200, duration: 600 }}
          style={styles.buttonGroup}
        >
          <TouchableOpacity style={styles.button} onPress={() => router.push('/job-log')}>
            <Text style={styles.buttonText}>🧾 Create Job Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/estimate')}>
            <Text style={styles.buttonText}>💵 Create Estimate</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4', // soft legal pad yellow
    position: 'relative',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // even more subtle white overlay
  },
  marginLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(211, 47, 47, 0.5)', // semi-transparent red
  },
  line: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.03)', // more subtle horizontal rule
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  titleRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonGroup: {
    gap: 16,
    marginTop: 80,
    maxWidth: 380,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '500',
  },
}); 