import React from 'react';
import AuthForm from '../components/AuthForm';

interface LoginPageProps {
  setLoading: (loading: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setLoading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <AuthForm setLoading={setLoading} />
    </div>
  );
};

export default LoginPage;