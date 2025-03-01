
// This is a mock implementation since actual haptic feedback
// would require native modules and React Native implementation

export type FeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Provides haptic feedback based on the type requested
 * In a real implementation, this would use React Native's
 * Haptic Feedback API or a library like react-native-haptic-feedback
 */
export const triggerHaptic = (type: FeedbackType = 'light'): void => {
  console.log(`Haptic feedback triggered: ${type}`);
  
  // In a web environment, we can simulate using vibration API if available
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate([30, 10, 30]);
        break;
      case 'success':
        navigator.vibrate([10, 50, 10]);
        break;
      case 'warning':
        navigator.vibrate([20, 20, 20]);
        break;
      case 'error':
        navigator.vibrate([50, 20, 100]);
        break;
      default:
        navigator.vibrate(10);
    }
  }
};

/**
 * Provides haptic feedback when a user interacts with a button
 */
export const buttonFeedback = (): void => {
  triggerHaptic('light');
};

/**
 * Provides success feedback for completed actions
 */
export const successFeedback = (): void => {
  triggerHaptic('success');
};

/**
 * Provides warning feedback for important notifications
 */
export const warningFeedback = (): void => {
  triggerHaptic('warning');
};

/**
 * Provides error feedback for critical issues
 */
export const errorFeedback = (): void => {
  triggerHaptic('error');
};

/**
 * Provides navigation feedback when changing routes
 */
export const navigationFeedback = (): void => {
  triggerHaptic('medium');
};
