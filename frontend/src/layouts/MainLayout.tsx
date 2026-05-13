import { Outlet } from 'react-router-dom';

import { Footer } from '../components/common/Footer';
import { Header } from '../components/common/Header';

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
