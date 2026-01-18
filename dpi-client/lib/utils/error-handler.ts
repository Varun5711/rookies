import toast from 'react-hot-toast';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status?: number;
}

/**
 * Get user-friendly error message from API error
 */
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error?.details?.message) {
    return error.response.data.error.details.message;
  }

  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.map((e: any) => e.message || e).join(', ');
    }
    if (typeof errors === 'string') {
      return errors;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Get error code from API error
 */
export function getErrorCode(error: any): string {
  return error?.response?.data?.error?.code || error?.code || 'UNKNOWN_ERROR';
}

/**
 * Get HTTP status code from error
 */
export function getErrorStatus(error: any): number | undefined {
  return error?.response?.status || error?.status;
}

/**
 * Show error toast with appropriate message
 */
export function showErrorToast(error: any, customMessage?: string) {
  const message = customMessage || getErrorMessage(error);
  const status = getErrorStatus(error);

  // Special handling for common status codes
  switch (status) {
    case 401:
      toast.error('Session expired. Please login again.');
      break;
    case 403:
      toast.error('You do not have permission to perform this action.');
      break;
    case 404:
      toast.error('The requested resource was not found.');
      break;
    case 429:
      toast.error('Too many requests. Please wait and try again.');
      break;
    case 500:
      toast.error('Server error. Please try again later.');
      break;
    case 503:
      toast.error('Service unavailable. Please try again later.');
      break;
    case 504:
      toast.error('Request timed out. Please try again.');
      break;
    default:
      toast.error(message);
  }
}

/**
 * Show success toast
 */
export function showSuccessToast(message: string) {
  toast.success(message);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return !error.response && !!error.message;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return (
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ETIMEDOUT' ||
    getErrorStatus(error) === 504
  );
}

/**
 * Check if error is an auth error
 */
export function isAuthError(error: any): boolean {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
}

/**
 * Check if error should be retried
 */
export function shouldRetry(error: any): boolean {
  const status = getErrorStatus(error);
  if (!status) return false;

  // Retry on server errors and timeouts
  return status >= 500 || status === 429 || isTimeoutError(error);
}

/**
 * Extract validation errors from error response
 */
export function getValidationErrors(error: any): Record<string, string> | null {
  if (error?.response?.data?.error?.details) {
    return error.response.data.error.details;
  }

  if (error?.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.reduce((acc: any, err: any) => {
        if (err.field && err.message) {
          acc[err.field] = err.message;
        }
        return acc;
      }, {});
    }
  }

  return null;
}
