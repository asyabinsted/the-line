// src/screens/DrawingScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Canvas from '../components/Canvas';
import { Point, LineSegment } from '../types';
import { saveLineSegment, loadAppData, getLastSegment } from '../utils/storage';
import { getTodayId } from '../utils/dateHelpers';
import { SIZES } from '../constants/theme';

interface DrawingScreenProps {
  onComplete: () => void;
}

const DrawingScreen: React.FC<DrawingScreenProps> = ({ onComplete }) => {
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previousSegments, setPreviousSegments] = useState<LineSegment[]>([]);
  const [startDotPosition, setStartDotPosition] = useState<Point>({ x: 100, y: 200, timestamp: 0 });
  const [endDotPosition, setEndDotPosition] = useState<Point>({ x: 100 + SIZES.finishDotDistance, y: 200, timestamp: 0 });

  // Load previous segments and calculate start position
  useEffect(() => {
    const loadData = async () => {
      const data = await loadAppData();
      const completedSegments = data.lineSegments.filter(s => s.completed);
      setPreviousSegments(completedSegments);

      // Calculate start dot position
      if (completedSegments.length > 0) {
        const lastSegment = completedSegments[completedSegments.length - 1];
        const lastPoint = lastSegment.endPoint;
        setStartDotPosition(lastPoint);
        setEndDotPosition({
          x: lastPoint.x + SIZES.finishDotDistance,
          y: lastPoint.y,
          timestamp: 0,
        });
      } else {
        // First day - start at a default position
        const startPos = { x: 100, y: 200, timestamp: 0 };
        setStartDotPosition(startPos);
        setEndDotPosition({
          x: startPos.x + SIZES.finishDotDistance,
          y: startPos.y,
          timestamp: 0,
        });
      }
    };

    loadData();
  }, []);

  // Calculate distance between two points
  const calculateDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // Check if point is near start dot
  const isNearStartDot = (x: number, y: number): boolean => {
    const distance = calculateDistance({ x, y, timestamp: 0 }, startDotPosition);
    return distance <= 30; // 30px radius
  };

  // Check if point is near end dot
  const isNearEndDot = (x: number, y: number): boolean => {
    const distance = calculateDistance({ x, y, timestamp: 0 }, endDotPosition);
    return distance <= 30; // 30px radius
  };

  const handleTouchStart = useCallback((x: number, y: number) => {
    // Only start drawing if touch is near start dot
    if (isNearStartDot(x, y)) {
      setIsDrawing(true);
      setCurrentPath([{ x, y, timestamp: Date.now() }]);
    }
  }, [startDotPosition]);

  const handleTouchMove = useCallback((x: number, y: number) => {
    if (!isDrawing) return;

    // Add point to path
    setCurrentPath(prev => [...prev, { x, y, timestamp: Date.now() }]);

    // Check if reached end dot
    if (isNearEndDot(x, y)) {
      handleComplete();
    }
  }, [isDrawing, endDotPosition]);

  const handleTouchEnd = useCallback(() => {
    if (!isDrawing) return;

    // If finger lifted before reaching end dot, reset
    setIsDrawing(false);
    setCurrentPath([]);
  }, [isDrawing]);

  const handleComplete = async () => {
    if (currentPath.length === 0) return;

    setIsDrawing(false);

    try {
      // Create segment
      const segment: LineSegment = {
        id: getTodayId(),
        date: new Date().toISOString(),
        path: currentPath,
        startPoint: currentPath[0],
        endPoint: currentPath[currentPath.length - 1],
        duration: (currentPath[currentPath.length - 1].timestamp - currentPath[0].timestamp) / 1000,
        completed: true,
      };

      // Save to storage
      await saveLineSegment(segment);

      // Call completion callback
      onComplete();
    } catch (error) {
      console.error('Error saving drawing:', error);
      // Reset on error
      setCurrentPath([]);
    }
  };

  return (
    <View style={styles.container}>
      <Canvas
        currentPath={currentPath}
        previousSegments={previousSegments}
        startDotPosition={startDotPosition}
        endDotPosition={endDotPosition}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        isDrawing={isDrawing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DrawingScreen;

