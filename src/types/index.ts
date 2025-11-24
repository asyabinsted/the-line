// src/types/index.ts

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface LineSegment {
  id: string; // Format: YYYY-MM-DD
  date: string; // ISO 8601 timestamp
  path: Point[];
  startPoint: Point;
  endPoint: Point;
  duration: number; // seconds
  completed: boolean;
}

export interface AppData {
  colorScheme: string;
  lineSegments: LineSegment[];
  stats: {
    totalDays: number;
    firstDrawing: string | null;
  };
}

