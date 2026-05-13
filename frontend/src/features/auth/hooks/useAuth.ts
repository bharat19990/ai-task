import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getMe } from '../authSlice';

/**
 * Hook for checking authentication status on app mount.
 */
export const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const { isCheckingAuth, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return { isCheckingAuth, isAuthenticated, user };
};

/**
 * Hook for accessing current auth state.
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  return { user, isAuthenticated, isLoading, error };
};
