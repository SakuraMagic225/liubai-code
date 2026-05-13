import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../layouts/MainLayout';
import { AboutPage } from '../pages/AboutPage';
import { ArchivePage } from '../pages/ArchivePage';
import { ArticlesPage } from '../pages/ArticlesPage';
import { HomePage } from '../pages/HomePage';

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'articles',
        element: <ArticlesPage />,
      },
      {
        path: 'archive',
        element: <ArchivePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);
