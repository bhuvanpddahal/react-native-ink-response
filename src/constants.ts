import { Pressable } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

import type { InkResponseProps } from './types';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Defaults = {
  position: 'relative',
  initialScale: 0.3,
  initialOpacity: 0.3,
  delayPressIn: 100,
  clipped: true,
  enterDuration: 300,
  enterEasing: Easing.linear,
  splashColor: 'rgba(0, 0, 0, 0.1)',
  splashPosition: 'tap',
  exitDuration: 300,
  exitEasing: Easing.linear,
  interruptible: false,
} satisfies InkResponseProps;
