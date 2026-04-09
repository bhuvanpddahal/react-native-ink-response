# React Native InkResponse

A high-performance, fully customizable **Material Design ink splash** component for React Native. Powered by `react-native-reanimated`, `react-native-gesture-handler` and `react-native-worklets`.

Inspired by Flutter's `InkResponse`, this library provides a fluid, hardware-accelerated ripple effect that can be clipped to its container or allowed to flow freely for icon buttons and circular surfaces.

## Features

- **🚀 Performance:** Runs entirely on the UI thread via Reanimated and Worklets.
- **🎨 Highly Customizable:** Control everything from splash radius and color to easing functions and durations.
- **🔗 Reanimated Integration:** Accepts `SharedValue` and `DerivedValue` for dynamic coloring.
- **📱 Gesture Driven:** Built on top of `react-native-gesture-handler` for native-feeling interactions.

---

## Installation

```bash
npm install react-native-ink-response
# OR
yarn add react-native-ink-response
```

> **Note:** This package requires `react-native-reanimated`, `react-native-gesture-handler` and `react-native-worklets` to be installed in your project.

---

## Usage

```tsx
import { InkResponse } from 'react-native-ink-response';

const MyButton = () => {
  return (
    <InkResponse
      onTap={() => console.log('Tapped!')}
      clipped={false} // Allow splash to exceed container bounds
      splashPosition="tap" // Start ripple exactly where finger touched
    >
      <View style={{ padding: 20 }}>
        <Text>Tap Me</Text>
      </View>
    </InkResponse>
  );
};
```

---

## API Reference

### Props

| Prop                 | Type                       | Default                | Description                                                                             |
| :------------------- | :------------------------- | :--------------------- | :-------------------------------------------------------------------------------------- |
| **`splashColor`**    | `InkResponseColor`         | `'rgba(0, 0, 0, 0.1)'` | The color of the ripple. Supports strings and Reanimated Shared/Derived values.         |
| **`splashPosition`** | `'tap' \| 'center'`        | `'tap'`                | Where the ripple starts. `'tap'` follows the finger; `'center'` starts from the middle. |
| **`splashRadius`**   | `number`                   | `Calculated`           | The maximum radius of the splash. By default, covers the entire container.              |
| **`clipped`**        | `boolean`                  | `true`                 | If `true`, the splash is contained within the view bounds (like `InkWell`).             |
| **`enterDuration`**  | `number`                   | `250`                  | Duration of the expansion animation in milliseconds.                                    |
| **`exitDuration`**   | `number`                   | `200`                  | Duration of the fade-out animation after release.                                       |
| **`initialScale`**   | `number`                   | `0.3`                  | The scale at which the splash begins.                                                   |
| **`initialOpacity`** | `number`                   | `0.3`                  | The opacity of the splash at the start of the animation.                                |
| **`delayPressIn`**   | `number`                   | `100`                  | Delay to distinguish long press.                                                        |
| **`interruptible`**  | `boolean`                  | `false`                | Whether a new tap can interrupt an ongoing enter animation.                             |
| **`position`**       | `'relative' \| 'absolute'` | `'relative'`           | The CSS position of the container.                                                      |

### Animation & Easing

| Prop              | Type             | Default                               | Description                                                       |
| :---------------- | :--------------- | :------------------------------------ | :---------------------------------------------------------------- |
| **`enterEasing`** | `EasingFunction` | `Easing.bezier(0.2, 0.6, 0.69, 0.93)` | Easing curve for the expansion (e.g., `Easing.out(Easing.quad)`). |
| **`exitEasing`**  | `EasingFunction` | `Easing.linear`                       | Easing curve for the fade-out.                                    |

> **Note:** Import `Easing` from `react-native-reanimated` package.

### Events

| Prop             | Type         | Description                                                         |
| :--------------- | :----------- | :------------------------------------------------------------------ |
| **`onTapBegin`** | `() => void` | Called the moment the finger touches the surface.                   |
| **`onTap`**      | `() => void` | Called on a successful tap/press.                                   |
| **`onTapEnd`**   | `() => void` | Called after the exit animation completes without any interruption. |

---

## License

MIT © [bhuvanpddahal](https://github.com/bhuvanpddahal)
