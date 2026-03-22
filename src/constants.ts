import { Pressable } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

export const INITIAL_SCALE = 0.3;
export const INITIAL_OPACITY = 0.3;
export const DELAY_PRESS_IN = 100;
export const DURATION = 300;
export const EASING = Easing.linear;
export const SPLASH_COLOR = 'rgba(0, 0, 0, 0.1)';
export const EXIT_DURATION = 300;
export const EXIT_EASING = Easing.linear;

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
