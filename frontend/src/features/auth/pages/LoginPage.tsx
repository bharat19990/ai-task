import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { useAuth } from '../hooks/useAuth';
import { login, clearError } from '../authSlice';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      // Error is handled by the slice
    }
  };

  return (
    <div className="glass-card p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-600/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
        <p className="text-surface-400 text-sm mt-1">
          Sign in to your PostHub account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          {...register('password')}
        />

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Sign In
        </Button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-6 pt-6 border-t border-surface-700/50">
        <p className="text-xs text-surface-500 text-center mb-3">
          Demo Accounts
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              dispatch(login({ email: 'admin@example.com', password: 'admin123' }))
                .unwrap()
                .then(() => {
                  toast.success('Welcome, Admin!');
                  navigate('/dashboard');
                });
            }}
            className="px-3 py-2 rounded-lg bg-surface-800/80 border border-surface-600/50 text-xs text-surface-300 hover:border-primary-500/30 hover:text-primary-400 transition-all cursor-pointer"
          >
            <span className="font-medium">Admin</span>
            <br />
            <span className="text-surface-500">admin@example.com</span>
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(login({ email: 'user@example.com', password: 'user123' }))
                .unwrap()
                .then(() => {
                  toast.success('Welcome!');
                  navigate('/dashboard');
                });
            }}
            className="px-3 py-2 rounded-lg bg-surface-800/80 border border-surface-600/50 text-xs text-surface-300 hover:border-primary-500/30 hover:text-primary-400 transition-all cursor-pointer"
          >
            <span className="font-medium">User</span>
            <br />
            <span className="text-surface-500">user@example.com</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
