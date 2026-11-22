import { useState } from 'react';
import { loginUser, registerUser } from '../api/leadsApi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleToggleMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setApiError('');
    setConfirmPassword('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    }

    if (isRegister && password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    setApiError('');

    try {
      const normalizedEmail = email.trim();
      let token;

      if (isRegister) {
        const regRes = await registerUser(normalizedEmail, password);
        if (regRes?.token) {
          token = regRes.token;
        } else {
          const loginRes = await loginUser(normalizedEmail, password);
          token = loginRes?.token;
        }
      } else {
        const loginRes = await loginUser(normalizedEmail, password);
        token = loginRes?.token;
      }

      if (!token) {
        throw new Error('Authentication succeeded without a token');
      }

      localStorage.setItem('lead_token', token);
      onAuthSuccess(token);
    } catch (err) {
      setApiError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-4 py-12 text-gray-900">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">
            LM
          </span>
          <span className="text-lg font-semibold text-gray-900">Lead Manager</span>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-5 grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => handleToggleMode('login')}
              disabled={submitting}
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                !isRegister
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode('register')}
              disabled={submitting}
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                isRegister
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          <div className="mb-4">
            <h1 className="text-base font-semibold text-gray-900">
              {isRegister ? 'Create your account' : 'Sign in to your account'}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {isRegister
                ? 'Start managing and tracking your sales pipeline'
                : 'Enter your credentials to access your leads'}
            </p>
          </div>

          {apiError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {apiError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onKeyDown={handleKeyDown}
                disabled={submitting}
                placeholder="you@company.com"
                autoComplete="email"
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                onKeyDown={handleKeyDown}
                disabled={submitting}
                placeholder="••••••••"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
                }`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {isRegister && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={submitting}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-500/20'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting
                ? isRegister
                  ? 'Creating account...'
                  : 'Signing in...'
                : isRegister
                  ? 'Create account'
                  : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
