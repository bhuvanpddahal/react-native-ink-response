import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolateColor,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AnimatedPressable, Defaults } from './constants';
import type {
  EnterAnimationStatus,
  HighlightProps,
  InkResponseProps,
} from './types';

export const InkResponse = ({
  ref,
  style,
  position = Defaults.position,
  initialScale = Defaults.initialScale,
  initialOpacity = Defaults.initialOpacity,
  pressInDelay = Defaults.pressInDelay,
  clipped = Defaults.clipped,
  enterDuration = Defaults.enterDuration,
  highlightEnterDuration = Defaults.highlightEnterDuration,
  enterEasing = Defaults.enterEasing,
  splashColor = Defaults.splashColor,
  highlightColor = Defaults.highlightColor,
  splashPosition = Defaults.splashPosition,
  splashRadius: radius,
  exitDuration = Defaults.exitDuration,
  highlightExitDuration = Defaults.highlightExitDuration,
  exitEasing = Defaults.exitEasing,
  interruptible = Defaults.interruptible,
  children,
  onTapBegin,
  onTap,
  onTapEnd,
  ...props
}: InkResponseProps) => {
  const timeout = useSharedValue(0);
  const splashScale = useSharedValue(0);
  const splashRadius = useSharedValue(0);
  const splashOpacity = useSharedValue(0);
  const hasTapEnded = useSharedValue(true);
  const translate = useSharedValue({ x: 0, y: 0 });
  const transformOrigin = useSharedValue('center');
  const animatedRef = useAnimatedRef<Animated.View>();
  const enterAnimationStatus =
    useSharedValue<EnterAnimationStatus>('completed');

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

  const runEnterAnimation = (x: number, y: number) => {
    'worklet';

    timeout.set(0);
    enterAnimationStatus.set('active');

    const layout = measure(containerRef);
    const width = layout?.width ?? 0;
    const height = layout?.height ?? 0;
    const tapX = splashPosition === 'tap' ? x : width / 2;
    const tapY = splashPosition === 'tap' ? y : height / 2;

    const _radius =
      radius === undefined ? Math.sqrt(width ** 2 + height ** 2) / 2 : radius;
    const shiftX = _radius - width / 2;
    const shiftY = _radius - height / 2;
    const originX = shiftX + tapX;
    const originY = shiftY + tapY;

    splashRadius.set(_radius);
    translate.set({ x: -shiftX, y: -shiftY });
    transformOrigin.set(`${originX}px ${originY}px`);
    splashScale.set(initialScale);
    splashOpacity.set(initialOpacity);
    splashScale.set(
      withTiming(1, {
        duration: enterDuration,
        easing: enterEasing,
      })
    );
    splashOpacity.set(
      withTiming(1, {
        duration: enterDuration,
        easing: enterEasing,
      })
    );
    timeout.set(
      withTiming(1, { duration: enterDuration }, (finished) => {
        if (!finished) return;

        enterAnimationStatus.set('completed');
        if (hasTapEnded.get()) {
          runExitAnimation();
        }
      })
    );
  };

  const tapGesture = Gesture.Tap()
    .maxDuration(Infinity)
    .onBegin((event) => {
      if (!interruptible && enterAnimationStatus.get() !== 'completed') {
        return;
      }

      if (enterAnimationStatus.get() !== 'completed') {
        cancelAnimation(timeout);
        cancelAnimation(splashScale);
        cancelAnimation(splashOpacity);
      }
      timeout.set(0);
      enterAnimationStatus.set('queued');

      timeout.set(
        withTiming(1, { duration: pressInDelay }, (finished) => {
          if (finished) {
            hasTapEnded.set(false);
            runEnterAnimation(event.x, event.y);
            if (onTapBegin) {
              scheduleOnRN(onTapBegin);
            }
          }
        })
      );
    })
    .onStart((event) => {
      if (enterAnimationStatus.get() === 'queued') {
        cancelAnimation(timeout);
        hasTapEnded.set(false);
        runEnterAnimation(event.x, event.y);
        if (onTapBegin) {
          scheduleOnRN(onTapBegin);
        }
      }
      if (onTap) {
        scheduleOnRN(onTap);
      }
    })
    .onFinalize(() => {
      hasTapEnded.set(true);

      if (enterAnimationStatus.get() === 'queued') {
        cancelAnimation(timeout);
      } else if (enterAnimationStatus.get() === 'completed') {
        runExitAnimation();
      }
    });

  const splashAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: splashRadius.get() * 2,
      height: splashRadius.get() * 2,
      borderRadius: splashRadius.get(),
      opacity: splashOpacity.get(),
      transform: [
        { translateX: translate.get().x },
        { translateY: translate.get().y },
        { scale: splashScale.get() },
      ],
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
        style={[style, { position }, clipped && styles.clipped]}
      >
        {highlightColor && (
          <Highlight
            highlightEnterDuration={highlightEnterDuration}
            highlightColor={highlightColor}
            highlightExitDuration={highlightExitDuration}
            hasTapEnded={hasTapEnded}
          />
        )}
        <Animated.View style={[styles.splash, splashAnimatedStyle]} />
        {children}
      </AnimatedPressable>
    </GestureDetector>
  );
};

const Highlight = ({
  highlightEnterDuration,
  highlightColor,
  highlightExitDuration,
  hasTapEnded,
}: HighlightProps) => {
  const activeProgress = useDerivedValue(() => {
    return withTiming(hasTapEnded.get() ? 0 : 1, {
      duration: hasTapEnded.get()
        ? highlightExitDuration
        : highlightEnterDuration,
    });
  });

  const highlightAnimatedStyle = useAnimatedStyle(() => {
    const highlight =
      typeof highlightColor === 'string'
        ? highlightColor
        : highlightColor.get();

    return {
      backgroundColor: interpolateColor(
        activeProgress.get(),
        [0, 1],
        ['transparent', highlight]
      ),
    };
  });

  return <Animated.View style={[styles.highlight, highlightAnimatedStyle]} />;
};

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    inset: 0,
  },
  splash: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  clipped: {
    overflow: 'hidden',
  },
});
