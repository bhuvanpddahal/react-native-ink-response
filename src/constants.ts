import { Pressable } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

import type { InkResponseProps } from './types';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Defaults = {
  position: 'relative',
  initialScale: 0.3,
  initialOpacity: 0.3,
  pressInDelay: 100,
  clipped: true,
  enterDuration: 250,
  highlightEnterDuration: 100,
  enterEasing: Easing.bezier(0.2, 0.6, 0.69, 0.93),
  splashColor: 'rgba(0, 0, 0, 0.1)',
  highlightColor: undefined,
  splashPosition: 'tap',
  exitDuration: 200,
  highlightExitDuration: 200,
  exitEasing: Easing.linear,
  interruptible: false,
} satisfies InkResponseProps;
