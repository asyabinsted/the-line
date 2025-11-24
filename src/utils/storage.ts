// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, LineSegment } from '../types';

const STORAGE_KEY = '@the_line_data';

const getDefaultAppData = (): AppData => ({
  colorScheme: '#3B82F6',
  lineSegments: [],
  stats: {
    totalDays: 0,
    firstDrawing: null,
  },
});

export const loadAppData = async (): Promise<AppData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      return getDefaultAppData();
    }
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Error loading app data:', error);
    return getDefaultAppData();
  }
};

export const saveAppData = async (data: AppData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving app data:', error);
    throw error;
  }
};

export const saveLineSegment = async (segment: LineSegment): Promise<void> => {
  try {
    const data = await loadAppData();
    
    // Remove any existing segment with the same ID (shouldn't happen, but just in case)
    data.lineSegments = data.lineSegments.filter(s => s.id !== segment.id);
    
    // Add new segment
    data.lineSegments.push(segment);
    
    // Sort by date
    data.lineSegments.sort((a, b) => a.id.localeCompare(b.id));
    
    // Update stats
    data.stats.totalDays = data.lineSegments.filter(s => s.completed).length;
    if (!data.stats.firstDrawing && segment.completed) {
      data.stats.firstDrawing = segment.date;
    }
    
    await saveAppData(data);
  } catch (error) {
    console.error('Error saving line segment:', error);
    throw error;
  }
};

export const getTodaySegment = async (): Promise<LineSegment | null> => {
  try {
    const data = await loadAppData();
    const today = new Date().toISOString().split('T')[0];
    return data.lineSegments.find(s => s.id === today) || null;
  } catch (error) {
    console.error('Error getting today segment:', error);
    return null;
  }
};

export const getLastSegment = async (): Promise<LineSegment | null> => {
  try {
    const data = await loadAppData();
    if (data.lineSegments.length === 0) {
      return null;
    }
    // Return the last completed segment
    const completedSegments = data.lineSegments.filter(s => s.completed);
    return completedSegments[completedSegments.length - 1] || null;
  } catch (error) {
    console.error('Error getting last segment:', error);
    return null;
  }
};

