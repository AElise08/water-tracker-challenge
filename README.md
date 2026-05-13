# Water Tracker - React Native Animation Challenge

React Native animation challenge focused on a fluid bottom-sheet number slider and animated water-fill interaction. The goal was to reproduce a high-performance mobile interaction with smooth gestures and UI-thread animations.

## Why this project matters

This project highlights mobile UI craft: gesture handling, animated values, spring physics, and performance-conscious React Native implementation.

## Tech stack

- React Native
- Expo
- React Native Reanimated
- React Native Gesture Handler
- Expo Haptics
- Expo Linear Gradient
- React Native SVG
- Lucide React Native

## Features

- Interactive bottom-sheet / number slider.
- Continuous pan gesture for changing hydration progress.
- Animated water-fill behavior.
- Smooth numeric updates during dragging.
- Spring-based animation for a more physical liquid feel.
- iOS-first Expo Go testing workflow.

## Technical highlights

- Used animated props for text updates to avoid unnecessary React re-renders during drag.
- Used spring physics to make the water movement feel less linear and more tactile.
- Preserved gesture context on drag start to prevent slider jumps.
- Focused on UI-thread animation performance for a 60fps experience.

## Getting started

```bash
git clone https://github.com/AElise08/water-tracker-challenge.git
cd water-tracker-challenge
npm install
npx expo start
```

Scan the QR code with Expo Go on iOS.

## Available scripts

```bash
npm start      # Start Expo
npm run ios    # Open iOS target
npm run android # Open Android target
npm run web    # Open web target
```

## License

0BSD
