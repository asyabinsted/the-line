// src/utils/dateHelpers.ts

import { LineSegment } from '../types';

export const canDrawToday = (segments: LineSegment[]): boolean => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const todaySegment = segments.find(s => s.id === today);
  return !todaySegment || !todaySegment.completed;
};

export const getTodayId = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getTodaySegment = (segments: LineSegment[]): LineSegment | null => {
  const today = getTodayId();
  return segments.find(s => s.id === today) || null;
};

