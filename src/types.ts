import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Animated, {
  type AnimatedRef,
  type DerivedValue,
  type EasingFunction,
  type EasingFunctionFactory,
  type SharedValue,
} from 'react-native-reanimated';

import type { AnimatedPressable } from './constants';

export type InkWellRef = AnimatedRef<Animated.View>;
export type InkWellPosition = 'relative' | 'absolute';
export type InkWellEasing = EasingFunction | EasingFunctionFactory;
export type InkWellSplashColor =
  | string
  | SharedValue<string>
  | DerivedValue<string>;
export type AnimationStatus = 'queued' | 'active' | 'completed';

type AnimatedPressableProps = Omit<
  ComponentPropsWithoutRef<typeof AnimatedPressable>,
  'ref' | 'key' | 'children'
>;

export type InkWellProps = AnimatedPressableProps & {
  ref?: InkWellRef;
  position?: InkWellPosition;
  initialScale?: number;
  initialOpacity?: number;
  delayPressIn?: number;
  clipped?: boolean;
  duration?: number;
  easing?: InkWellEasing;
  splashColor?: InkWellSplashColor;
  exitDuration?: number;
  exitEasing?: InkWellEasing;
  interruptible?: boolean;
  children?: ReactNode;
  onTapBegin?: () => void;
  onTap?: () => void;
  onTapEnd?: () => void;
};
