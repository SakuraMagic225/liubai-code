import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logoutAdmin } from '../api/auth';
import { clearAdminSession, getStoredAdminProfile } from '../api/adminSession';

const navItems = [
  { label: '文章管理', to: '/admin/articles' },
  { label: '标签管理', to: '/admin/tags' },
  { label: '站点设置', to: '/admin/settings' },
  { label: '返回前台', to: '/' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const adminProfile = getStoredAdminProfile();

  async function handleLogout() {
    try {
      await logoutAdmin();
    } finally {
      clearAdminSession();
      navigate('/admin/login', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8f3] text-green-800">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-green-100 bg-white lg:block">
        <div className="border-b border-green-100 px-6 py-5">
          <p className="text-xl font-semibold text-green-800">留白code</p>
          <p className="mt-1 text-sm text-green-600/70">后台管理</p>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-green-50 text-green-800'
                    : 'text-green-600 hover:bg-coral-50 hover:text-coral-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-60">
        <header className="border-b border-green-100 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm text-green-600/70">Admin</p>
              <h1 className="text-lg font-semibold text-green-800">内容工作台</h1>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-sm text-green-600/75">
                {adminProfile?.nickname || adminProfile?.username || '管理员'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-green-100 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
              >
                退出登录
              </button>
            </div>
            <nav className="flex gap-2 lg:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-green-50 text-green-800'
                        : 'text-green-600 hover:bg-coral-50 hover:text-coral-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
