import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, ActivityIndicator, Animated } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';

interface EstimateSection {
  title: string;
  items: {
    label: string;
    total: string;
  }[];
}

export default function Output() {
  const { input, type } = useLocalSearchParams();
  const [output, setOutput] = useState('');
  const [viewMode, setViewMode] = useState<'chart' | 'text'>('chart');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toggleAnim = React.useRef(new Animated.Value(0)).current;

  const generateOutput = async () => {
    try {
      setIsLoading(true);
      const backendUrl = __DEV__ 
        ? 'http://192.168.4.41:8000'  // Your local IP address
        : 'https://your-production-url.com';  // Replace with your production URL

      const response = await fetch(`${backendUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: input as string,
          type: type as string,
          user_name: "WorkNote User"
        }),
      });

      const data = await response.json();
      
      if (data.output?.startsWith('Error:')) {
        Alert.alert('Error', data.output);
        setOutput('');
        return;
      }
      
      setOutput(data.output);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to the server. Please make sure the backend is running and accessible.');
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateOutput();
  }, [input, type]);

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: viewMode === 'chart' ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [viewMode]);

  const parseEstimate = (text: string): EstimateSection[] => {
    if (!text || typeof text !== 'string') {
      return [];
    }

    try {
      const sections = text.split(/\n\n+/).filter(Boolean);

      return sections.map((section) => {
        const [header, ...lines] = section?.split('\n') ?? [];
        const title = header?.trim() || 'Untitled';

        const items = (lines || [])
          .filter((line) => line.includes(':'))
          .map((line) => {
            const [label, total] = line.split(':');
            return {
              label: label?.trim() || '—',
              total: total?.trim() || '',
            };
          });

        return { title, items };
      });
    } catch (err) {
      return [];
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: output,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the content.');
    }
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(output);
      Alert.alert('Success', 'Content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy text: ', error);
      Alert.alert('Error', 'Failed to copy text to clipboard');
    }
  };

  const handleRegenerate = () => {
    generateOutput();
  };

  const renderStructuredOutput = () => {
    try {
      if (!output) {
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No data available</Text>
          </View>
        );
      }

      const sections = parseEstimate(output);

      if (!Array.isArray(sections) || sections.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Could not parse the data into sections</Text>
          </View>
        );
      }

      return (
        <View style={styles.structuredContainer}>
          {sections.map((section, idx) => {
            if (!section || !Array.isArray(section.items)) {
              return null;
            }

            return (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title || 'Untitled Section'}</Text>
                {section.items.map((item, i) => {
                  if (!item) {
                    return null;
                  }

                  return (
                    <View key={i} style={styles.itemRow}>
                      <Text style={styles.itemLabel}>{item.label || '—'}</Text>
                      <Text style={styles.itemTotal}>{item.total || ''}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      );
    } catch (err) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Error displaying content</Text>
        </View>
      );
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === 'chart' ? 'text' : 'chart');
  };

  const toggleLeft = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: type === 'job' ? 'Job Log' : 'Estimate',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Description Box */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>
            {type === 'job' ? 'Your Job Log' : 'Your Estimate'}
          </Text>
          <Text style={styles.descriptionText}>
            {type === 'job' 
              ? "Here's your professional job log. You can copy it, share it, or save it for your records."
              : "Here's your professional estimate. You can copy it, share it, or save it for your records."}
          </Text>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2A5F9E" />
            <Text style={styles.loadingText}>Generating {type === 'job' ? 'job log' : 'estimate'}</Text>
          </View>
        ) : (
          <>
            {/* View Mode Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                onPress={toggleView}
                style={styles.toggleButton}
              >
                <Animated.View 
                  style={[
                    styles.toggleSlider,
                    { left: toggleLeft }
                  ]} 
                />
                <View style={styles.toggleOption}>
                  <Text style={[
                    styles.toggleText,
                    viewMode === 'chart' && styles.toggleTextActive
                  ]}>
                    Chart
                  </Text>
                </View>
                <View style={styles.toggleOption}>
                  <Text style={[
                    styles.toggleText,
                    viewMode === 'text' && styles.toggleTextActive
                  ]}>
                    Text
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Output Content */}
            <View style={styles.outputBox}>
              {viewMode === 'chart' ? renderStructuredOutput() : (
                <Text style={styles.outputText}>{output}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleShare}
              >
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleCopy}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Copy as Text</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRegenerate}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
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
  toggleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  toggleButton: {
    width: 200,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  toggleSlider: {
    position: 'absolute',
    width: 100,
    height: 40,
    backgroundColor: '#2A5F9E',
    borderRadius: 20,
  },
  toggleOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  outputBox: {
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
  outputText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  structuredContainer: {
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A5F9E',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  itemLabel: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  itemTotal: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonGroup: {
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2A5F9E',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#444',
  },
  shareButton: {
    marginRight: 16,
  },
  shareButtonText: {
    color: '#2A5F9E',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2A5F9E',
    fontWeight: '600',
  },
}); 