# Quick Start Guide

Get The Line running in under 5 minutes.

## Prerequisites Check

```bash
# Check Node.js version (need 16+)
node --version

# Check if npm is installed
npm --version

# Check if Expo CLI is available
npx expo --version
```

## Setup (First Time Only)

```bash
# 1. Navigate to project directory
cd /Users/asyabinsted/Documents/Line

# 2. Dependencies are already installed, but if you need to reinstall:
# npm install

# 3. Clear any cache
npx expo start -c
```

## Running the App

### Option 1: Physical iPhone (RECOMMENDED for accurate testing)

1. **Install Expo Go**
   - Open App Store on your iPhone
   - Search for "Expo Go"
   - Install the app

2. **Start Dev Server**
   ```bash
   npm start
   ```

3. **Connect Your Device**
   - Open Camera app on iPhone
   - Point at the QR code in terminal
   - Tap the notification to open in Expo Go
   - Wait for app to build and load

### Option 2: iOS Simulator (for quick preview only)

```bash
# This will open Xcode Simulator
npm run ios
```

**Note**: Simulator doesn't accurately represent touch performance. Always test drawing on a physical device.

## First Use Testing

### Test 1: Basic Drawing (30 seconds)

1. App opens with a blue dot (start) and outlined dot (end)
2. Touch the blue start dot and hold
3. Drag your finger toward the end dot
4. Keep finger on screen until you reach the end dot
5. Drawing should auto-save

**Expected**: Line appears, follows finger, saves when you reach end dot

**If it fails**: Lift finger and try again (line will disappear)

### Test 2: Reset on Lift (15 seconds)

1. Start drawing from start dot
2. Lift finger before reaching end dot
3. Line should disappear immediately

**Expected**: Can try again right away, no limit on attempts

### Test 3: Daily Lock (30 seconds)

1. Complete a drawing (reach end dot)
2. App shows "Come back tomorrow" message
3. Can pan/zoom to view your drawing
4. Cannot draw again today

**Expected**: Locked state shows total days drawn

### Test 4: Persistence (20 seconds)

1. Complete a drawing
2. Close the Expo Go app completely (swipe up)
3. Reopen from home screen
4. App should show your drawing in locked state

**Expected**: Drawing persists after app restart

### Test 5: Pan and Zoom (30 seconds)

1. Use two fingers to drag around canvas
2. Pinch with two fingers to zoom in/out
3. Should work on both locked and drawing screens

**Expected**: Smooth pan/zoom, no lag

## Common Issues & Fixes

### "Metro bundler stopped"
```bash
# Restart with cache clear
npx expo start -c
```

### "Network error" or can't connect
```bash
# Make sure iPhone and computer are on same WiFi
# Try tunnel mode:
npx expo start --tunnel
```

### Drawing feels laggy
- Test on physical device (simulator is always slow)
- Close other apps on phone
- Try restarting Expo Go app

### Can't start drawing
- Make sure you're touching the blue start dot (not empty space)
- Touch radius is 30px around the dot
- Try tapping directly on the dot center

### Pan/zoom doesn't work
- Must use TWO fingers (one finger is for drawing)
- If stuck, close and reopen app

### App crashes on launch
```bash
# Clear everything and rebuild
rm -rf node_modules
npm install
npx expo start -c
```

## Development Workflow

### Make Changes to Code

1. Edit files in `src/` directory
2. Save file (Cmd+S)
3. App auto-reloads in Expo Go (takes 5-10 seconds)

### Force Reload App

- Shake your iPhone
- Tap "Reload" in the menu

### View Console Logs

- Check terminal where `npm start` is running
- Logs from `console.log()` appear there

## Testing Multiple Days

To test the next-day functionality, you have two options:

### Option A: Wait Until Tomorrow
- Complete a drawing today
- Check app tomorrow
- Start dot should be at yesterday's end point

### Option B: Manual Testing (Advanced)
- Modify the date in `dateHelpers.ts` temporarily
- Clear AsyncStorage data
- Test with different dates

**Note**: For Phase 1 MVP, just test same-day behavior. Multi-day testing comes in Phase 2.

## Performance Benchmarks

Target metrics (on physical iPhone):
- Drawing: 60 FPS
- Pan/Zoom: 60 FPS
- App Launch: < 2 seconds
- Drawing Save: < 500ms

Measure FPS:
1. Shake device in Expo Go
2. Enable "Show Perf Monitor"
3. Check FPS while drawing

## Next Steps After Basic Testing

1. ✅ Basic drawing works
2. ✅ Reset on lift works
3. ✅ Daily lock works
4. ✅ Persistence works
5. ✅ Pan/zoom works
6. ⏳ Test with 5+ days of drawings
7. ⏳ Performance test with 30+ days
8. ⏳ Test on different device sizes

## Git Workflow for Changes

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your change description"

# Merge back to main
git checkout main
git merge feature/your-feature
```

## Getting Help

If something isn't working:

1. Check terminal output for errors
2. Look for red error screen in Expo Go
3. Try clearing cache: `npx expo start -c`
4. Check that all dependencies installed: `npm install`
5. Verify Node.js version: `node --version` (need 16+)

## Ready for Phase 2?

Once all Phase 1 tests pass:
- Drawing works smoothly
- Daily lock works
- Persistence works
- Pan/zoom works
- Performance is acceptable

Then move on to:
- Testing with multiple days
- Viewport culling optimization
- Device size testing
- Edge case handling

---

**Estimated time to first drawing: 2-3 minutes** ⚡

