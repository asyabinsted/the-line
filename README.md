# The Line

A daily drawing app where users extend one continuous line once per day, creating a personal visual timeline over months/years.

## Project Status

**MVP Development - Phase 1 Complete** ✅

Core functionality implemented:
- ✅ Touch-based drawing from start dot to end dot
- ✅ One drawing per day enforcement (local timezone)
- ✅ Lift finger = line resets (can try again immediately)
- ✅ Auto-save when end dot is reached
- ✅ Display all previous drawings
- ✅ Pan (two-finger) and pinch-to-zoom gestures
- ✅ Locked screen when day's drawing is complete
- ✅ Persistent storage using AsyncStorage

## Tech Stack

- **Framework**: React Native + Expo (SDK 54)
- **Drawing**: @shopify/react-native-skia
- **Gestures**: react-native-gesture-handler + react-native-reanimated
- **Storage**: @react-native-async-storage/async-storage
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo Go app on iOS device (for testing)
- Xcode (for iOS simulator)

### Installation

```bash
# Install dependencies (already done)
npm install

# Start development server
npm start
```

### Running the App

**Option 1: Physical Device (Recommended)**
1. Install Expo Go from the App Store
2. Run `npm start`
3. Scan QR code with Camera app (iOS)

**Option 2: iOS Simulator**
```bash
npm run ios
```

## Project Structure

```
/Line
├── src/
│   ├── components/
│   │   └── Canvas.tsx          # Skia canvas with drawing logic
│   ├── screens/
│   │   ├── DrawingScreen.tsx   # Main drawing interface
│   │   └── LockedScreen.tsx    # View when drawing complete
│   ├── utils/
│   │   ├── storage.ts          # AsyncStorage functions
│   │   └── dateHelpers.ts      # Date utilities
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── constants/
│       └── theme.ts            # Colors, sizes, zoom levels
├── App.tsx                     # Main app entry point
└── babel.config.js             # Babel config with Reanimated
```

## How It Works

### Drawing Flow

1. **Start**: User must touch the start dot (blue circle) to begin drawing
2. **Draw**: Keep finger on screen and draw a continuous line
3. **Complete**: Reach the end dot (outlined circle) to auto-save
4. **Reset**: Lift finger before reaching end = line disappears, try again

### Daily Limit

- Only one drawing allowed per calendar day (local timezone)
- After completing a drawing, app shows "Come back tomorrow"
- Next day, start dot appears at previous day's end point
- Line grows left-to-right, creating a continuous timeline

### Canvas Interaction

- **Pan**: Use two fingers to move around the canvas
- **Zoom**: Pinch to zoom in/out (0.5x to 3x)
- Works on both DrawingScreen and LockedScreen

## Testing Checklist

### Core Functionality
- [ ] Draw from start to end without lifting → saves ✅
- [ ] Lift finger mid-drawing → line disappears ✅
- [ ] Complete drawing, close app, reopen → persists ✅
- [ ] Complete drawing, reopen same day → locked state ✅
- [ ] Complete drawing, reopen next day → new start dot at previous end ⏳
- [ ] Load app with 30 days of data → renders smoothly ⏳

### Gestures
- [ ] Two-finger pan works smoothly ✅
- [ ] Pinch zoom works (0.5x to 3x) ✅
- [ ] Drawing doesn't interfere with pan/zoom ✅

### Performance
- [ ] 60fps during drawing ⏳
- [ ] Smooth pan/zoom with multiple segments ⏳
- [ ] No lag with 1000+ points per drawing ⏳

**Note**: Performance testing should be done on a physical iOS device, not simulator.

## Known Limitations (MVP)

- No undo/erase (by design - only reset is lift finger)
- No pressure sensitivity
- No animations or visual effects
- No onboarding screens
- No settings
- No widgets
- No cloud sync
- No sharing/export
- iOS only (Android support later)

## Data Storage

All data is stored locally using AsyncStorage:

```typescript
{
  colorScheme: string,
  lineSegments: LineSegment[],
  stats: {
    totalDays: number,
    firstDrawing: string | null
  }
}
```

Each LineSegment contains:
- id: YYYY-MM-DD format
- date: ISO 8601 timestamp
- path: Array of {x, y, timestamp} points
- startPoint & endPoint
- duration: seconds
- completed: boolean

## Next Steps (Phase 2)

1. **Performance Testing**
   - Test with 30+ days of drawings
   - Measure FPS during drawing and pan/zoom
   - Implement viewport culling if needed

2. **Bug Fixes**
   - Test on multiple device sizes
   - Handle edge cases (first launch, corrupted data)
   - Test timezone edge cases

3. **Polish** (if time permits)
   - Smooth drawing interpolation
   - Better visual feedback
   - Simple onboarding

## Development Commands

```bash
# Start dev server
npm start

# Run on iOS
npm run ios

# Run on Android (not yet configured)
npm run android

# Run on web (not supported for this app)
npm run web

# Git workflow
git checkout -b feature/your-feature
git add .
git commit -m "feat: your feature description"
git checkout main
git merge feature/your-feature
```

## Troubleshooting

### "Reanimated plugin not found"
Make sure `babel.config.js` includes:
```js
plugins: ['react-native-reanimated/plugin']
```

### Drawing feels laggy
Test on a physical device. iOS Simulator doesn't represent real performance.

### Can't pan/zoom
Make sure you're using two fingers. Single finger is reserved for drawing.

### App crashes on launch
Clear cache: `expo start -c`

## License

Private project - All rights reserved.

## Contact

For questions or issues, contact the development team.

