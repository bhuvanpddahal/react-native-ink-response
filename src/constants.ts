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
  enterDuration: 250,
  enterEasing: Easing.bezier(0.2, 0.6, 0.69, 0.93),
  splashColor: 'rgba(0, 0, 0, 0.1)',
  splashPosition: 'tap',
  exitDuration: 200,
  exitEasing: Easing.linear,
  interruptible: false,
} satisfies InkResponseProps;
