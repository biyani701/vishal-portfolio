# Modern Viewport Units Implementation

This document explains the implementation of modern viewport units in the portfolio project to fix mobile viewport issues.

## Overview

The project now uses modern viewport units (`dvh`, `svh`, `lvh`, etc.) with proper fallbacks to address mobile browser viewport inconsistencies. The implementation is centralized in the theme system and custom hooks.

## New Viewport Units

### Dynamic Viewport Units
- **`dvh`** (Dynamic Viewport Height) - Adjusts as mobile browser UI shows/hides
- **`dvw`** (Dynamic Viewport Width) - Dynamic viewport width
- **`dvi`** (Dynamic Viewport Inline) - Dynamic inline dimension
- **`dvb`** (Dynamic Viewport Block) - Dynamic block dimension

### Static Viewport Units
- **`svh`** (Small Viewport Height) - Smallest possible viewport height
- **`svw`** (Small Viewport Width) - Smallest possible viewport width
- **`svi`** (Small Viewport Inline) - Small inline dimension
- **`svb`** (Small Viewport Block) - Small block dimension

### Large Viewport Units
- **`lvh`** (Large Viewport Height) - Largest possible viewport height
- **`lvw`** (Large Viewport Width) - Largest possible viewport width
- **`lvi`** (Large Viewport Inline) - Large inline dimension
- **`lvb`** (Large Viewport Block) - Large block dimension

## Implementation

### 1. Theme Integration (`src/theme.js`)

The theme now includes viewport utilities:

```javascript
viewport: {
  units: {
    dvh: (value) => ({
      height: `${value}vh`, // Fallback
      height: `${value}dvh`, // Modern
    }),
    // ... other units
  },
  helpers: {
    fullHeight: () => ({
      minHeight: "100vh", // Fallback
      minHeight: "100dvh", // Modern
    }),
    contentHeight: (headerPx, footerPx) => ({
      height: `calc(100vh - ${headerPx}px - ${footerPx}px)`, // Fallback
      height: `calc(100dvh - ${headerPx}px - ${footerPx}px)`, // Modern
    }),
    // ... other helpers
  },
}
```

### 2. Enhanced Layout Hook (`src/hooks/useLayoutDimensions.js`)

The hook now provides:
- Modern viewport support detection
- Enhanced safe area calculations
- Mobile-specific breakpoint detection
- Improved safeOffsets calculations

Key improvements:
- Better iPhone X detection with more device sizes
- Debounced resize handling for performance
- Orientation change detection
- Fallback safe area values for known devices

### 3. Viewport Units Hook (`src/hooks/useViewportUnits.js`)

New dedicated hook for viewport utilities:
- Modern viewport unit functions with fallbacks
- Safe area aware calculations
- Mobile-optimized containers
- CSS custom properties generation

## Usage Examples

### Basic Viewport Heights

```javascript
import { useViewportUnits } from '../hooks/useViewportUnits';

const MyComponent = () => {
  const { dvh, svh, fullHeight } = useViewportUnits();
  
  return (
    <Box sx={{
      ...fullHeight(), // Full viewport height with mobile optimization
      // or
      ...dvh(100), // 100dvh with fallback
      // or
      ...svh(100), // 100svh for consistent mobile experience
    }}>
      Content
    </Box>
  );
};
```

### Content Area with Header/Footer

```javascript
const ContentArea = styled(Box)(({ theme }) => {
  const { contentHeight } = useViewportUnits();
  const { headerHeight, footerHeight } = useLayoutDimensions();
  
  return {
    ...contentHeight(headerHeight, footerHeight),
    padding: theme.spacing(2),
  };
});
```

### Mobile-Optimized Container

```javascript
const MobileContainer = styled(Box)(({ theme }) => ({
  ...theme.viewport.helpers.mobileOptimizedHeight(),
  paddingTop: `max(${theme.spacing(2)}, env(safe-area-inset-top, 0px))`,
  paddingBottom: `max(${theme.spacing(2)}, env(safe-area-inset-bottom, 0px))`,
}));
```

### Safe Area Aware Layout

```javascript
const SafeLayout = () => {
  const { safeContentHeight } = useViewportUnits();
  const { headerHeight, footerHeight } = useLayoutDimensions();
  
  return (
    <Box sx={{
      ...safeContentHeight(headerHeight, footerHeight),
      // Automatically accounts for safe areas and modern viewport units
    }}>
      Content that respects safe areas
    </Box>
  );
};
```

## CSS Integration

The CSS files have been updated to use modern viewport units with fallbacks:

```css
.hero-container {
  min-height: 100vh; /* Fallback */
  min-height: 100dvh; /* Dynamic viewport height */
}

.modal {
  max-height: 90vh; /* Fallback */
  max-height: 90dvh; /* Dynamic viewport height */
  width: calc(100vw - 32px); /* Fallback */
  width: calc(100dvw - 32px); /* Dynamic viewport width */
}
```

## Mobile Improvements

### Enhanced Safe Area Detection
- Better detection of iPhone X and similar devices
- Fallback safe area values when CSS env() isn't available
- Improved calculations for small mobile devices

### Responsive Breakpoints
- `isSmallMobile` - 320px and below (iPhone SE)
- `isMediumMobile` - 320px to 480px (most phones)
- `isLargeMobile` - 480px to 540px (large phones)

### Improved safeOffsets
- Mobile-specific top/bottom offsets
- Better landscape mode handling
- Safe area integration with modern viewport units

## Browser Support

- **Modern browsers**: Full support for new viewport units
- **Older browsers**: Graceful fallback to traditional `vh`/`vw` units
- **Detection**: Automatic detection of viewport unit support

## Performance Optimizations

- Debounced resize handling (100ms)
- Cached calculations in theme helpers
- Memoized hook values
- Efficient safe area detection

## Migration Guide

### From Old Implementation
1. Replace `100vh` with `...fullHeight()` or `...dvh(100)`
2. Use `contentHeight()` for header/footer layouts
3. Replace manual safe area calculations with `safeContentHeight()`
4. Use the new breakpoint helpers for mobile detection

### Best Practices
1. Always use the hook utilities instead of hardcoded viewport units
2. Prefer `dvh` for mobile-friendly full-height layouts
3. Use `svh` for consistent mobile experiences
4. Include safe area padding for mobile layouts
5. Test on actual mobile devices with browser UI changes

## Testing

Use the `ViewportDemo` component to test viewport behavior:
- Shows supported viewport units
- Displays current device information
- Demonstrates safe area calculations
- Tests mobile-specific layouts

## Troubleshooting

### Common Issues
1. **Layout jumping on mobile**: Use `svh` instead of `dvh` for consistency
2. **Content hidden behind browser UI**: Ensure safe area padding is applied
3. **Incorrect calculations**: Check if modern viewport support is detected correctly

### Debug Information
The `useLayoutDimensions` hook provides debug information:
- `hasModernViewportSupport` - Whether modern units are supported
- `safeAreaInsets` - Current safe area values
- Device type detection flags
- Window dimensions
