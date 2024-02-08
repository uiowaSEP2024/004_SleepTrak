import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import Root from './components/Root';
import ClientsPage from './pages/ClientsPage';
import BabiesPage from './pages/Babies';
import MessagesPage from './pages/Messages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/clients',
        element: <ClientsPage />
      },
      {
        path: '/babies',
        element: <BabiesPage />
      },
      {
        path: '/messages',
        element: <MessagesPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
