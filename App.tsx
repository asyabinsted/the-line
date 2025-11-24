import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawingScreen from './src/screens/DrawingScreen';
import LockedScreen from './src/screens/LockedScreen';
import { loadAppData } from './src/utils/storage';
import { canDrawToday } from './src/utils/dateHelpers';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [canDraw, setCanDraw] = useState(false);

  const checkDrawingStatus = async () => {
    try {
      const data = await loadAppData();
      const canDrawNow = canDrawToday(data.lineSegments);
      setCanDraw(canDrawNow);
    } catch (error) {
      console.error('Error checking drawing status:', error);
      setCanDraw(true); // Default to allowing drawing on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkDrawingStatus();
  }, []);

  const handleDrawingComplete = () => {
    // After drawing is complete, switch to locked screen
    setCanDraw(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      {canDraw ? (
        <DrawingScreen onComplete={handleDrawingComplete} />
      ) : (
        <LockedScreen />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
