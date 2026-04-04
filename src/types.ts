import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Animated, {
  type AnimatedRef,
  type DerivedValue,
  type EasingFunction,
  type EasingFunctionFactory,
  type SharedValue,
} from 'react-native-reanimated';

import type { AnimatedPressable } from './constants';

export type InkResponseRef = AnimatedRef<Animated.View>;
export type InkResponsePosition = 'relative' | 'absolute';
export type InkResponseEasing = EasingFunction | EasingFunctionFactory;
export type InkResponseColor =
  | string
  | SharedValue<string>
  | DerivedValue<string>;
export type InkResponseSplashPosition = 'tap' | 'center';
export type EnterAnimationStatus = 'queued' | 'active' | 'completed';

type AnimatedPressableProps = Omit<
  ComponentPropsWithoutRef<typeof AnimatedPressable>,
  'ref' | 'key' | 'children'
>;

export type InkResponseProps = AnimatedPressableProps & {
  ref?: InkResponseRef;
  position?: InkResponsePosition;
  initialScale?: number;
  initialOpacity?: number;
  delayPressIn?: number;
  clipped?: boolean;
  enterDuration?: number;
  enterEasing?: InkResponseEasing;
  splashColor?: InkResponseColor;
  splashPosition?: InkResponseSplashPosition;
  splashRadius?: number;
  exitDuration?: number;
  exitEasing?: InkResponseEasing;
  interruptible?: boolean;
  children?: ReactNode;
  onTapBegin?: () => void;
  onTap?: () => void;
  onTapEnd?: () => void;
};
