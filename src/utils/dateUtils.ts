import { format, formatDuration, intervalToDuration } from 'date-fns';

/**
 * Format ISO timestamp to human-readable date/time
 */
export const formatDateTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
};

/**
 * Format ISO timestamp to short date
 */
export const formatDate = (isoString: string): string => {
  try {
    return format(new Date(isoString), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
};

/**
 * Format ISO timestamp to time only
 */
export const formatTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), 'HH:mm:ss');
  } catch (error) {
    console.error('Error formatting time:', error);
    return isoString;
  }
};

/**
 * Format duration in hours to human-readable format
 */
export const formatCycleDuration = (hours: number): string => {
  try {
    const milliseconds = hours * 3600 * 1000;
    const duration = intervalToDuration({ start: 0, end: milliseconds });
    return formatDuration(duration, {
      format: ['days', 'hours', 'minutes'],
      delimiter: ', ',
    });
  } catch (error) {
    console.error('Error formatting duration:', error);
    return `${hours.toFixed(2)} hours`;
  }
};

/**
 * Format duration to compact format
 */
export const formatDurationCompact = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h}h ${m}m`;
};
