import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getErrorMessage,
  showSuccessToast,
  showErrorToast,
} from '@/lib/utils/error-handler';

/**
 * Hook for handling query and mutation errors
 */
export function useErrorHandler() {
  const queryClient = useQueryClient();

  const handleError = useCallback((error: any, customMessage?: string) => {
    console.error('Error:', error);
    showErrorToast(error, customMessage);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    showSuccessToast(message);
  }, []);

  const invalidateQueries = useCallback(
    (queryKeys: string[] | string[][]) => {
      if (Array.isArray(queryKeys[0])) {
        (queryKeys as string[][]).forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys });
      }
    },
    [queryClient],
  );

  return {
    handleError,
    handleSuccess,
    invalidateQueries,
  };
}

/**
 * Hook for handling form submission errors
 */
export function useFormHandler() {
  const handleError = useCallback((error: any) => {
    console.error('Form error:', error);
    showErrorToast(error);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    showSuccessToast(message);
  }, []);

  return {
    handleError,
    handleSuccess,
  };
}

/**
 * Hook for handling deletion actions
 */
export function useDeleteHandler() {
  const handleError = useCallback((error: any) => {
    console.error('Delete error:', error);
    showErrorToast(error, 'Failed to delete item');
  }, []);

  const handleSuccess = useCallback((itemName = 'Item') => {
    showSuccessToast(`${itemName} deleted successfully`);
  }, []);

  return {
    handleError,
    handleSuccess,
  };
}
