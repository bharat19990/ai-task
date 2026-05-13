import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-surface-100 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-surface-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved. Check the
          URL or go back to the dashboard.
        </p>

        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
