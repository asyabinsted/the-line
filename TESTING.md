# Testing Guide - The Line MVP

## Phase 1 Testing (Day 1-2)

### Priority Tests

#### ✅ Test 1: Single Drawing Session
**Objective**: Verify basic drawing mechanics

**Steps**:
1. Launch app (first time)
2. Observe start dot (blue filled circle) and end dot (blue outlined circle)
3. Touch start dot and hold
4. Drag finger toward end dot in any path
5. Reach end dot

**Expected**:
- Line appears immediately on touch
- Line follows finger smoothly (no lag)
- Line connects all points
- Auto-saves when reaching end dot (no button needed)
- App transitions to locked screen
- Shows "Come back tomorrow"

**Pass Criteria**: ✅ All expected behaviors occur

---

#### ✅ Test 2: Reset on Lift
**Objective**: Verify line resets if finger lifts early

**Steps**:
1. Start drawing from start dot
2. Draw halfway to end dot
3. Lift finger

**Expected**:
- Line disappears immediately
- Start dot and end dot remain
- Can immediately try again
- No error messages

**Pass Criteria**: ✅ Line resets, can retry unlimited times

---

#### ✅ Test 3: Touch Outside Start Dot
**Objective**: Verify drawing only starts near start dot

**Steps**:
1. Touch empty space (not near start dot)
2. Drag finger around
3. Touch near start dot (within 30px)
4. Drag to end dot

**Expected**:
- Nothing happens when touching empty space
- Drawing starts only when touching start dot area
- 30px radius around dot is active area

**Pass Criteria**: ✅ Drawing only starts from start dot

---

#### ✅ Test 4: Daily Lock
**Objective**: Verify one-per-day enforcement

**Steps**:
1. Complete a drawing (reach end dot)
2. App shows locked screen
3. Try to touch anywhere on screen
4. Use two fingers to pan/zoom

**Expected**:
- "Come back tomorrow" message displays
- Shows "1 day drawn" counter
- Cannot start new drawing
- Pan/zoom still works
- Previous drawing visible

**Pass Criteria**: ✅ Cannot draw again, viewing works

---

#### ✅ Test 5: Persistence
**Objective**: Verify data saves and loads correctly

**Steps**:
1. Complete a drawing
2. Close Expo Go completely (force quit)
3. Reopen app from home screen
4. Wait for app to load

**Expected**:
- App shows locked screen (not drawing screen)
- Previous drawing is visible
- "Come back tomorrow" message shows
- Can pan/zoom to view drawing
- No data loss

**Pass Criteria**: ✅ Drawing persists across app restarts

---

#### ✅ Test 6: Pan and Zoom (Drawing Screen)
**Objective**: Verify gestures work while in drawing mode

**Steps**:
1. Launch app (can draw state)
2. Use two fingers to drag canvas
3. Use two fingers to pinch zoom
4. Try single finger (should start drawing if on start dot)

**Expected**:
- Two-finger pan moves canvas smoothly
- Two-finger pinch zooms in/out (0.5x to 3x)
- Single finger doesn't pan
- Start/end dots move with canvas
- Zoom limits enforced

**Pass Criteria**: ✅ Gestures work, no conflicts

---

#### ✅ Test 7: Pan and Zoom (Locked Screen)
**Objective**: Verify gestures work when viewing completed drawings

**Steps**:
1. Complete a drawing (locked screen)
2. Use two fingers to pan
3. Use two fingers to zoom
4. Pan to see entire drawing

**Expected**:
- Can explore full drawing
- Smooth pan/zoom
- Drawing remains visible
- Can zoom from 0.5x to 3x

**Pass Criteria**: ✅ Can explore completed drawings

---

### Edge Cases

#### Edge Case 1: Very Fast Drawing
**Steps**:
1. Touch start dot
2. Quickly swipe to end dot (< 1 second)

**Expected**:
- Line still captures path
- Saves successfully
- No crashes

---

#### Edge Case 2: Very Slow Drawing
**Steps**:
1. Touch start dot
2. Very slowly move toward end dot (> 60 seconds)
3. Keep finger pressed entire time

**Expected**:
- Line continues to follow
- No timeout
- Saves when reaching end dot

---

#### Edge Case 3: Zigzag Path
**Steps**:
1. Draw in zigzag pattern
2. Cross over previous parts of line
3. Reach end dot

**Expected**:
- All paths captured
- Line can overlap itself
- Saves successfully

---

#### Edge Case 4: First Launch (No Data)
**Steps**:
1. Fresh install (or clear app data)
2. Launch app

**Expected**:
- Start dot appears at default position (100, 200)
- End dot appears ~650px to the right
- No errors
- Can draw immediately

---

#### Edge Case 5: Corrupted Data
**Steps** (requires manual AsyncStorage edit):
1. Save a drawing
2. Manually corrupt storage (invalid JSON)
3. Relaunch app

**Expected**:
- App doesn't crash
- Falls back to default state
- Console warning about corrupted data
- Can draw as if first time

---

## Performance Tests

### Perf Test 1: Drawing Smoothness
**Objective**: Measure FPS during active drawing

**Steps**:
1. Enable Perf Monitor in Expo Go (shake device)
2. Start drawing from start dot
3. Move finger continuously toward end dot
4. Observe FPS counter

**Target**: 60 FPS consistently

**Pass if**: FPS stays above 55 during drawing

---

### Perf Test 2: Point Density
**Objective**: Test with many points in one drawing

**Steps**:
1. Draw very slowly from start to end
2. Create 1000+ points (slowly over 60+ seconds)
3. Observe rendering performance
4. Complete drawing

**Target**: No visible lag even with 1000+ points

**Pass if**: Smooth rendering throughout

---

### Perf Test 3: Pan/Zoom Smoothness
**Objective**: Measure FPS during pan/zoom

**Steps**:
1. Complete a drawing
2. Enable Perf Monitor
3. Rapidly pan and zoom with two fingers
4. Observe FPS counter

**Target**: 60 FPS during gestures

**Pass if**: FPS stays above 55 during gestures

---

### Perf Test 4: App Launch Time
**Objective**: Measure cold start performance

**Steps**:
1. Force quit app
2. Start timer
3. Launch app from home screen
4. Stop timer when start dot appears

**Target**: < 2 seconds

**Pass if**: Visible within 2 seconds

---

## Phase 2 Testing (Day 3+)

### Multi-Day Tests

#### Test 8: Second Day Drawing
**Objective**: Verify start dot positioning after first drawing

**Setup**: Complete a drawing on Day 1

**Steps** (next day):
1. Open app
2. Observe start dot position
3. Should be at previous day's end point

**Expected**:
- Start dot at Day 1's end point
- End dot ~650px to the right of new start
- Can draw from new position

**Pass Criteria**: Start dot continues from previous end

---

#### Test 9: Multiple Days (5+ days)
**Objective**: Test with realistic usage

**Steps**:
1. Complete 5 drawings over 5 days
2. Each day: draw, verify save, close app
3. On day 6, view all drawings

**Expected**:
- All 5 drawings visible
- Connected line timeline
- No performance issues
- Stats show "5 days drawn"

**Pass Criteria**: All drawings persist and display

---

#### Test 10: Large Dataset (30+ days)
**Objective**: Test performance with month of data

**Setup**: Need 30 days of test data (or mock data)

**Steps**:
1. Load app with 30+ drawings
2. Measure load time
3. Pan across entire timeline
4. Zoom in/out on different sections
5. Observe FPS and lag

**Expected**:
- Load time < 3 seconds
- 60 FPS while panning
- Smooth zoom at any position
- No memory issues

**Pass Criteria**: Performance acceptable with full month

---

### Viewport Tests

#### Test 11: Off-Screen Drawings
**Objective**: Verify drawings far from viewport still work

**Steps**:
1. Complete 10+ days of drawings
2. Pan to see only most recent 3 days
3. Check memory usage
4. Pan to oldest 3 days
5. Check rendering

**Expected**:
- Only visible segments render (optimization)
- Quick pan response
- No white screens or loading delays

**Pass Criteria**: Off-screen optimization works

---

## Device Tests

### Device Test 1: iPhone 15 Pro
- Screen size: 6.1" (1179 x 2556)
- Expected: Default behavior, everything fits

### Device Test 2: iPhone SE (older/smaller)
- Screen size: 4.7" (750 x 1334)
- Expected: UI scales appropriately, dots visible

### Device Test 3: iPhone 15 Pro Max
- Screen size: 6.7" (1290 x 2796)
- Expected: Utilizes extra space, no overflow

---

## Integration Tests

### Integration 1: AsyncStorage
**Verify**:
- Data saves on completion
- Data loads on launch
- Handles empty storage
- Handles corrupted storage

### Integration 2: Date/Time
**Verify**:
- Correct timezone detection
- Midnight boundary handling
- DST transitions (if applicable)

### Integration 3: Gesture Handling
**Verify**:
- Single touch = drawing
- Two touch = pan/zoom
- No conflicts between gestures
- Simultaneous touches handled

---

## Automated Testing Notes

Current MVP has no automated tests. Recommended for Phase 3:

```typescript
// Example test structure for future

describe('Drawing Mechanics', () => {
  test('line starts only near start dot', () => {
    // Test touch detection
  });
  
  test('line resets on lift', () => {
    // Test reset behavior
  });
  
  test('saves on completion', () => {
    // Test save logic
  });
});

describe('Storage', () => {
  test('loads default data on first launch', () => {
    // Test initial state
  });
  
  test('persists drawing data', () => {
    // Test save/load
  });
});
```

---

## Bug Report Template

When reporting issues, include:

```
**Device**: iPhone [model]
**iOS Version**: [version]
**Expo Go Version**: [version]
**App Version**: [git commit hash]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**:

**Actual Behavior**:

**Screenshots/Video**:

**Console Errors**:

**Frequency**: Always / Sometimes / Once
```

---

## Known Issues (as of Phase 1)

### Issue 1: Gesture Conflicts
**Status**: Fixed in commit fe6825e
**Description**: Single touch could trigger pan
**Solution**: Check touch count before handling

### Issue 2: Completion Race Condition
**Status**: Fixed in commit 28c89dd
**Description**: handleComplete could use stale path
**Solution**: Pass path explicitly to completion handler

---

## Test Results Log

| Test | Status | Date | Device | Notes |
|------|--------|------|--------|-------|
| Test 1: Single Drawing | ⏳ | - | - | Not tested yet |
| Test 2: Reset on Lift | ⏳ | - | - | Not tested yet |
| Test 3: Touch Outside | ⏳ | - | - | Not tested yet |
| Test 4: Daily Lock | ⏳ | - | - | Not tested yet |
| Test 5: Persistence | ⏳ | - | - | Not tested yet |
| Test 6: Pan/Zoom Drawing | ⏳ | - | - | Not tested yet |
| Test 7: Pan/Zoom Locked | ⏳ | - | - | Not tested yet |

---

## Next Steps

1. **Run Priority Tests 1-7** on physical iPhone
2. Document any failures
3. Fix critical issues
4. Retest failures
5. Move to Performance Tests
6. Document results

**Goal**: All Phase 1 tests passing before moving to Phase 2

---

**Last Updated**: [Current Date]
**Test Coverage**: Phase 1 ready, Phase 2 pending implementation

