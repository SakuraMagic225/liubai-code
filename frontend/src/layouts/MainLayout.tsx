import { Outlet } from 'react-router-dom';

import { Footer } from '../components/common/Footer';
import { Header } from '../components/common/Header';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
