import { createBrowserRouter } from 'react-router-dom';

import { AdminLayout } from '../layouts/AdminLayout';
import { MainLayout } from '../layouts/MainLayout';
import { AboutPage } from '../pages/AboutPage';
import { AdminArticleEditPage } from '../pages/admin/AdminArticleEditPage';
import { AdminArticleListPage } from '../pages/admin/AdminArticleListPage';
import { ArchivePage } from '../pages/ArchivePage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';
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
        path: 'articles/:id',
        element: <ArticleDetailPage />,
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
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminArticleListPage />,
      },
      {
        path: 'articles',
        element: <AdminArticleListPage />,
      },
      {
        path: 'articles/new',
        element: <AdminArticleEditPage />,
      },
      {
        path: 'articles/:id/edit',
        element: <AdminArticleEditPage />,
      },
    ],
  },
]);
