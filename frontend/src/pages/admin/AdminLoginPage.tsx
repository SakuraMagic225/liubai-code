import { FormEvent, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { loginAdmin } from '../../api/auth';
import { getAdminToken, saveAdminSession } from '../../api/adminSession';

interface LocationState {
  from?: {
    pathname: string;
    search: string;
  };
}

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = getAdminToken();

  const redirectPath = useMemo(() => {
    const redirect = searchParams.get('redirect');
    if (redirect?.startsWith('/admin') && redirect !== '/admin/login') {
      return redirect;
    }

    const state = location.state as LocationState | null;
    if (state?.from?.pathname?.startsWith('/admin')) {
      return `${state.from.pathname}${state.from.search ?? ''}`;
    }

    return '/admin/articles';
  }, [location.state, searchParams]);

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const loginResult = await loginAdmin({ username, password });
      saveAdminSession(loginResult);
      navigate(redirectPath, { replace: true });
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '登录失败');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8f3] px-5 py-10 text-green-800">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-green-100 bg-white p-8 shadow-soft">
        <p className="text-sm font-medium text-coral-400">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-green-800">后台登录</h1>
        <p className="mt-3 text-sm leading-6 text-green-600/75">登录后可以管理文章、标签和站点资料。</p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="admin-username">
              用户名
            </label>
            <input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="admin-password">
              密码
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              placeholder="请输入密码"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-md border border-coral-100 bg-coral-50 px-4 py-3 text-sm text-coral-600">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-coral-400 px-4 py-2.5 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
}
