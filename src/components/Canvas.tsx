// src/components/Canvas.tsx

import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Canvas as SkiaCanvas, Path, Skia, Circle } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Point, LineSegment } from '../types';
import { COLORS, SIZES } from '../constants/theme';

interface CanvasProps {
  currentPath: Point[];
  previousSegments: LineSegment[];
  startDotPosition: Point;
  endDotPosition: Point;
  onTouchStart: (x: number, y: number) => void;
  onTouchMove: (x: number, y: number) => void;
  onTouchEnd: () => void;
  isDrawing: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  currentPath,
  previousSegments,
  startDotPosition,
  endDotPosition,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isDrawing,
}) => {
  const { width, height } = useWindowDimensions();

  // Pan and zoom state
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

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

  // Create paths for previous segments
  const previousPaths = useMemo(() => {
    return previousSegments.map(segment => ({
      id: segment.id,
      path: createPath(segment.path),
    }));
  }, [previousSegments]);

  // Create path for current drawing
  const currentSkiaPath = useMemo(() => {
    return createPath(currentPath);
  }, [currentPath]);

  // Touch gesture (for drawing)
  const touchGesture = Gesture.Manual()
    .onTouchesDown((event) => {
      // Only handle single finger touches for drawing
      if (event.allTouches.length !== 1) return;
      if (isDrawing) return; // Already drawing
      
      const touch = event.allTouches[0];
      const x = (touch.x - translateX.value) / scale.value;
      const y = (touch.y - translateY.value) / scale.value;
      
      onTouchStart(x, y);
    })
    .onTouchesMove((event) => {
      // Only continue if single finger and drawing
      if (event.allTouches.length !== 1) return;
      if (!isDrawing) return;
      
      const touch = event.allTouches[0];
      const x = (touch.x - translateX.value) / scale.value;
      const y = (touch.y - translateY.value) / scale.value;
      
      onTouchMove(x, y);
    })
    .onTouchesUp(() => {
      if (!isDrawing) return;
      onTouchEnd();
    })
    .onTouchesCancelled(() => {
      if (!isDrawing) return;
      onTouchEnd();
    });

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

  // Combine gestures
  const composed = Gesture.Simultaneous(
    touchGesture,
    Gesture.Race(panGesture, pinchGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(translateX.value) },
      { translateY: withSpring(translateY.value) },
      { scale: withSpring(scale.value) },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.canvasContainer, animatedStyle]}>
          <SkiaCanvas style={{ width, height }}>
            {/* Draw previous segments */}
            {previousPaths.map((item) => (
              item.path && (
                <Path
                  key={item.id}
                  path={item.path}
                  color={COLORS.primary}
                  style="stroke"
                  strokeWidth={SIZES.lineWidth}
                  strokeCap="round"
                  strokeJoin="round"
                />
              )
            ))}

            {/* Draw current path */}
            {currentSkiaPath && (
              <Path
                path={currentSkiaPath}
                color={COLORS.primary}
                style="stroke"
                strokeWidth={SIZES.lineWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            )}

            {/* Start dot */}
            <Circle
              cx={startDotPosition.x}
              cy={startDotPosition.y}
              r={SIZES.dotRadius}
              color={COLORS.dot}
            />

            {/* End dot */}
            <Circle
              cx={endDotPosition.x}
              cy={endDotPosition.y}
              r={SIZES.dotRadius}
              color={COLORS.dot}
              style="stroke"
              strokeWidth={2}
            />
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
  canvasContainer: {
    flex: 1,
  },
});

export default Canvas;

