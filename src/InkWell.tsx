import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  AnimatedPressable,
  DELAY_PRESS_IN,
  DURATION,
  EASING,
  EXIT_DURATION,
  EXIT_EASING,
  INITIAL_OPACITY,
  INITIAL_SCALE,
  SPLASH_COLOR,
} from './constants';
import type { AnimationStatus, InkWellProps } from './types';

export const InkWell = ({
  ref,
  style,
  initialScale = INITIAL_SCALE,
  initialOpacity = INITIAL_OPACITY,
  delayPressIn = DELAY_PRESS_IN,
  clipped = true,
  duration = DURATION,
  easing = EASING,
  splashColor = SPLASH_COLOR,
  exitDuration = EXIT_DURATION,
  exitEasing = EXIT_EASING,
  interruptible = false,
  children,
  onTapBegin,
  onTap,
  onTapEnd,
  ...props
}: InkWellProps) => {
  const timeout = useSharedValue(0);
  const splashScale = useSharedValue(0);
  const splashRadius = useSharedValue(0);
  const splashOpacity = useSharedValue(0);
  const hasTapped = useSharedValue(false);
  const hasTapEnded = useSharedValue(false);
  const transformOrigin = useSharedValue('center');
  const tapPosition = useSharedValue({ x: 0, y: 0 });
  const animatedRef = useAnimatedRef<Animated.View>();
  const animationStatus = useSharedValue<AnimationStatus>('completed');

  const containerRef = ref ?? animatedRef;

  const runExitAnimation = () => {
    'worklet';

    splashOpacity.set(
      withTiming(
        0,
        {
          duration: exitDuration,
          easing: exitEasing,
        },
        (finished) => {
          if (finished) {
            splashScale.set(0);
            if (onTapEnd) {
              scheduleOnRN(onTapEnd);
            }
          }
        }
      )
    );
  };

  const runAnimation = (x: number, y: number) => {
    'worklet';

    timeout.set(0);
    animationStatus.set('active');

    const layout = measure(containerRef);
    const width = layout?.width ?? 0;
    const height = layout?.height ?? 0;

    splashRadius.set(Math.sqrt(width ** 2 + height ** 2));
    transformOrigin.set('center');
    tapPosition.set({ x, y });
    splashScale.set(initialScale);
    splashOpacity.set(initialOpacity);
    splashScale.set(
      withTiming(1, {
        duration,
        easing,
      })
    );
    splashOpacity.set(
      withTiming(1, {
        duration,
        easing,
      })
    );
    timeout.set(
      withTiming(1, { duration }, (finished) => {
        if (!finished) return;

        animationStatus.set('completed');
        if (hasTapEnded.get()) {
          runExitAnimation();
        }
      })
    );
  };

  const tapGesture = Gesture.Tap()
    .maxDuration(Infinity)
    .onBegin((event) => {
      if (!interruptible && animationStatus.get() !== 'completed') return;

      if (animationStatus.get() !== 'completed') {
        cancelAnimation(timeout);
        cancelAnimation(splashScale);
        cancelAnimation(splashOpacity);
      }
      timeout.set(0);
      hasTapped.set(false);
      hasTapEnded.set(false);
      animationStatus.set('queued');

      timeout.set(
        withTiming(1, { duration: delayPressIn }, (finished) => {
          if (finished) {
            runAnimation(event.x, event.y);
            if (onTapBegin) {
              scheduleOnRN(onTapBegin);
            }
          }
        })
      );
    })
    .onStart((event) => {
      hasTapped.set(true);

      if (animationStatus.get() === 'queued') {
        cancelAnimation(timeout);
        runAnimation(event.x, event.y);
        if (onTapBegin) {
          scheduleOnRN(onTapBegin);
        }
      }
      if (hasTapped.get() && onTap) {
        scheduleOnRN(onTap);
      }
    })
    .onFinalize(() => {
      hasTapEnded.set(true);

      if (animationStatus.get() === 'queued') {
        cancelAnimation(timeout);
      } else if (animationStatus.get() === 'completed') {
        runExitAnimation();
      }
    });

  const splashAnimatedStyle = useAnimatedStyle(() => {
    let translateX = 0,
      translateY = 0;

    return {
      width: splashRadius.get() * 2,
      height: splashRadius.get() * 2,
      borderRadius: splashRadius.get(),
      opacity: splashOpacity.get(),
      transform: [{ translateX }, { translateY }, { scale: splashScale.get() }],
      transformOrigin: transformOrigin.get(),
      backgroundColor:
        typeof splashColor === 'string' ? splashColor : splashColor.get(),
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedPressable
        {...props}
        ref={containerRef}
        style={[style, styles.container, clipped && { overflow: 'hidden' }]}
      >
        <Animated.View style={[styles.splash, splashAnimatedStyle]} />
        {children}
      </AnimatedPressable>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  splash: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
