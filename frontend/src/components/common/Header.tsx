import { NavLink } from 'react-router-dom';

const navItems = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/articles' },
  { label: '归档', path: '/archive' },
  { label: '关于', path: '/about' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-green-100/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <NavLink to="/" className="group inline-flex flex-col">
          <span className="text-xl font-semibold tracking-normal text-green-800 group-hover:text-coral-400">
            留白code
          </span>
          <span className="text-xs text-green-600/70">用代码留白，为思考赋能</span>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-green-600 sm:gap-x-7">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'text-coral-400' : 'text-green-600'}`
              }
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
