// Test file to verify useLayoutDimensions hook
import React from 'react';
import { useLayoutDimensions } from './hooks/useLayoutDimensions';

const TestHook = () => {
  const {
    headerHeight,
    footerHeight,
    device,
    isPortrait,
    deviceName,
    hasModernViewportSupport,
    safeAreaInsets
  } = useLayoutDimensions();

  console.log('Hook test results:', {
    headerHeight,
    footerHeight,
    device,
    isPortrait,
    deviceName,
    hasModernViewportSupport,
    safeAreaInsets
  });

  return (
    <div>
      <h2>Hook Test Results</h2>
      <p>Header Height: {headerHeight}px</p>
      <p>Footer Height: {footerHeight}px</p>
      <p>Device Name: {deviceName}</p>
      <p>Is Portrait: {isPortrait ? 'Yes' : 'No'}</p>
      <p>Modern Viewport Support: {hasModernViewportSupport ? 'Yes' : 'No'}</p>
      <p>Safe Area Insets: {JSON.stringify(safeAreaInsets)}</p>
    </div>
  );
};

export default TestHook;
