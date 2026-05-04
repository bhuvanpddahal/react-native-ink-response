# React Native InkResponse

A high-performance, fully customizable **Material Design ink splash** component for React Native. Powered by `react-native-reanimated`, `react-native-gesture-handler` and `react-native-worklets`.

## Features

- **🚀 Performance:** Runs entirely on the UI thread via Reanimated and Worklets.
- **🎨 Highly Customizable:** Control everything from splash radius and color to easing functions and durations.
- **🔗 Reanimated Integration:** Accepts `SharedValue` and `DerivedValue` for dynamic coloring.
- **📱 Gesture Driven:** Built on top of `react-native-gesture-handler` for native-feeling interactions.

---

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [License](#license)

## Installation

```bash
npm install react-native-ink-response
# OR
yarn add react-native-ink-response
```

> **Note:** This package requires `react-native-reanimated`, `react-native-gesture-handler` and `react-native-worklets` to be installed in your project.

---

## Basic Usage

```tsx
import { Text } from 'react-native';
import { InkResponse } from 'react-native-ink-response';

const MyButton = () => {
  return (
    <InkResponse
      highlightColor="#d97706"
      style={{
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 50,
        backgroundColor: '#f59e0b',
      }}
    >
      <Text
        style={{
          color: 'black',
          fontWeight: '500',
          textAlign: 'center',
        }}
      >
        Tap me
      </Text>
    </InkResponse>
  );
};
```

For more, check out the [Examples](#examples) section below.

---

## API Reference

### Props

| Prop                 | Type                       | Default                | Description                                                                             |
| :------------------- | :------------------------- | :--------------------- | :-------------------------------------------------------------------------------------- |
| **`splashColor`**    | `InkResponseColor`         | `'rgba(0, 0, 0, 0.1)'` | The color of the ripple. Supports strings and Reanimated Shared/Derived values.         |
| **`splashPosition`** | `'tap' \| 'center'`        | `'tap'`                | Where the ripple starts. `'tap'` follows the finger; `'center'` starts from the middle. |
| **`splashRadius`**   | `number`                   | `Calculated`           | The maximum radius of the splash. By default, covers the entire container.              |
| **`highlightColor`** | `InkResponseColor`         | `—`                    | The color of the persistent overlay shown while the surface is pressed.                 |
| **`clipped`**        | `boolean`                  | `true`                 | If `true`, the splash is contained within the view bounds (like `InkWell`).             |
| **`initialScale`**   | `number`                   | `0.3`                  | The scale at which the splash begins.                                                   |
| **`initialOpacity`** | `number`                   | `0.3`                  | The opacity of the splash at the start of the animation.                                |
| **`pressInDelay`**   | `number`                   | `100`                  | Wait time before activating the splash to distinguish tapping from scrolling.           |
| **`interruptible`**  | `boolean`                  | `false`                | Whether a new tap can interrupt an ongoing enter animation.                             |
| **`position`**       | `'relative' \| 'absolute'` | `'relative'`           | The CSS position of the container.                                                      |

### Animation & Easing

| Prop                         | Type             | Default                               | Description                                                       |
| :--------------------------- | :--------------- | :------------------------------------ | :---------------------------------------------------------------- |
| **`enterDuration`**          | `number`         | `250`                                 | Duration of the expansion animation in milliseconds.              |
| **`exitDuration`**           | `number`         | `200`                                 | Duration of the fade-out animation after release.                 |
| **`enterEasing`**            | `EasingFunction` | `Easing.bezier(0.2, 0.6, 0.69, 0.93)` | Easing curve for the expansion (e.g., `Easing.out(Easing.quad)`). |
| **`exitEasing`**             | `EasingFunction` | `Easing.linear`                       | Easing curve for the fade-out.                                    |
| **`highlightEnterDuration`** | `number`         | `100`                                 | Duration (ms) for the highlight to fade in.                       |
| **`highlightExitDuration`**  | `number`         | `200`                                 | Duration (ms) for the highlight to fade out after release.        |

> Import `Easing` from `react-native-reanimated` package.

### Events

| Prop             | Type         | Description                                                         |
| :--------------- | :----------- | :------------------------------------------------------------------ |
| **`onTapBegin`** | `() => void` | Called the moment the finger touches the surface.                   |
| **`onTap`**      | `() => void` | Called on a successful tap/press.                                   |
| **`onTapEnd`**   | `() => void` | Called after the exit animation completes without any interruption. |

---

## Examples

### 1. Standard "InkWell" (Clipped Card)

This is the most common use case. The ripple is constrained to the container's borders, making it perfect for list items or interactive cards.

```tsx
import { Text } from 'react-native';
import { InkResponse } from 'react-native-ink-response';

const SettingsCard = () => (
  <InkResponse
    onTap={() => console.log('Settings Pressed')}
    splashColor="rgba(0, 0, 0, 0.1)"
    clipped={true} // Ripple is contained within the borderRadius
    style={{
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#eee',
      backgroundColor: '#fff',
    }}
  >
    <Text style={{ fontSize: 16, fontWeight: '600' }}>Account Settings</Text>
    <Text style={{ color: '#666' }}>Privacy, security, and language</Text>
  </InkResponse>
);
```

### 2. Circular Icon Button (Unclipped)

By setting `clipped={false}`, you allow the ripple to expand into a perfect circle that can exceed the touch target's bounds - essential for Material-style icon buttons.

```tsx
import { InkResponse } from 'react-native-ink-response';
import { Ionicons } from '@expo/vector-icons'; // Or your preferred icon library

const RoundIconButton = () => (
  <InkResponse
    onTap={() => console.log('Search clicked')}
    clipped={false} // Allows the ripple to overflow
    splashPosition="center" // Ripple starts from the icon center
    splashRadius={28} // Constrains the circular splash size, increase/decrease as needed
    splashColor="rgba(33, 150, 243, 0.2)"
    style={{
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Ionicons name="search" size={24} color="#2196F3" />
  </InkResponse>
);
```

### 3. High-Energy "Snappy" Ripple

You can customize the animation feel by overriding the default durations and easing functions. This example creates a very fast, responsive-feeling press.

```tsx
import { Text } from 'react-native';
import { InkResponse } from 'react-native-ink-response';
import { Easing } from 'react-native-reanimated';

const SnappyButton = () => (
  <InkResponse
    enterDuration={150} // Rapid expansion
    exitDuration={80} // Quick fade out
    enterEasing={Easing.out(Easing.quad)}
    splashColor="#7E22CE"
    onTap={() => console.log('Snappy pressed!')}
    style={{
      width: '100%',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      backgroundColor: '#A855F7',
      borderRadius: 4,
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>FAST ACTION</Text>
  </InkResponse>
);
```

### 4. Dynamic Theming (Scroll-Linked Animation)

This example demonstrates the use case for passing Shared or Derived Values to splashColor. Inspired by the Google Search app, the search bar's background and ripple color smoothly interpolate as the user scrolls.

```tsx
import { Dimensions, Text, View } from 'react-native';
import { InkResponse } from 'react-native-ink-response';
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const scrollThreshold = 0;
const interpolationRange = 80;
const screenHeight = Dimensions.get('screen').height;

const SearchInputScreen = () => {
  const scrollY = useSharedValue(0);

  // Interpolate the button background based on scroll position
  const backgroundColor = useDerivedValue(() => {
    return interpolateColor(
      scrollY.get(),
      [scrollThreshold, scrollThreshold + interpolationRange],
      ['#E5E5E5', '#FFFFFF']
    );
  });

  // Dynamically update the splash color to match the changing background
  const splashColor = useDerivedValue(() => {
    return interpolateColor(
      scrollY.get(),
      [scrollThreshold, scrollThreshold + interpolationRange],
      ['#C9C9C9', '#E5E5E5']
    );
  });

  const handleScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });

  return (
    <Animated.ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      stickyHeaderIndices={[0]}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      {/* Sticky Header with Dynamic InkResponse */}
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: 'white',
        }}
      >
        <InkResponse
          onTap={() => console.log('Search input tapped!')}
          splashColor={splashColor} // Accepts DerivedValue!
          style={{
            width: '100%',
            padding: 20,
            borderRadius: 40,
            borderWidth: 1,
            borderColor: '#E5E5E5',
            backgroundColor, // Accepts DerivedValue!
          }}
        >
          <Text style={{ fontSize: 20, color: '#525252' }}>Search</Text>
        </InkResponse>
      </View>

      {/* Spacer to allow scrolling */}
      <View style={{ height: screenHeight }} />
    </Animated.ScrollView>
  );
};
```

---

## License

MIT © [bhuvanpddahal](https://github.com/bhuvanpddahal)
