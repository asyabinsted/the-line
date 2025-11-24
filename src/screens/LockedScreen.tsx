// src/screens/LockedScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas as SkiaCanvas, Path, Skia, Circle } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LineSegment, Point } from '../types';
import { loadAppData } from '../utils/storage';
import { COLORS, SIZES } from '../constants/theme';

const LockedScreen: React.FC = () => {
  const [segments, setSegments] = useState<LineSegment[]>([]);
  const { width, height } = useWindowDimensions();

  // Pan and zoom state
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  // Load all segments
  useEffect(() => {
    const loadData = async () => {
      const data = await loadAppData();
      setSegments(data.lineSegments.filter(s => s.completed));
    };
    loadData();
  }, []);

  // Convert points array to Skia path
  const createPath = (points: Point[]) => {
    if (points.length === 0) return null;

    const path = Skia.Path.Make();
    path.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }

    return path;
  };

  // Pan gesture (two fingers)
  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    });

  // Pinch gesture (for zoom)
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.max(0.5, Math.min(3, newScale));
    });

  const composed = Gesture.Race(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(translateX.value) },
      { translateY: withSpring(translateY.value) },
      { scale: withSpring(scale.value) },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Come back tomorrow</Text>
        <Text style={styles.subText}>
          {segments.length} {segments.length === 1 ? 'day' : 'days'} drawn
        </Text>
      </View>

      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.canvasContainer, animatedStyle]}>
          <SkiaCanvas style={{ width, height }}>
            {/* Draw all segments */}
            {segments.map((segment) => {
              const path = createPath(segment.path);
              return path ? (
                <Path
                  key={segment.id}
                  path={path}
                  color={COLORS.primary}
                  style="stroke"
                  strokeWidth={SIZES.lineWidth}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ) : null;
            })}

            {/* Show dots at each segment junction */}
            {segments.map((segment) => (
              <React.Fragment key={`dots-${segment.id}`}>
                <Circle
                  cx={segment.startPoint.x}
                  cy={segment.startPoint.y}
                  r={SIZES.dotRadius / 2}
                  color={COLORS.dot}
                />
              </React.Fragment>
            ))}
          </SkiaCanvas>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messageContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
  },
  subText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 8,
    opacity: 0.6,
  },
  canvasContainer: {
    flex: 1,
  },
});

export default LockedScreen;

