import React, { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    // If we're redirected back with a token, log the user in
    const token = searchParams.get('token');
    if (token) {
      login(token);
      navigate('/'); // Redirect to dashboard
    } else if (user) {
      // If already logged in, redirect to dashboard
      navigate('/');
    }
  }, [searchParams, login, navigate, user]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/40">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
