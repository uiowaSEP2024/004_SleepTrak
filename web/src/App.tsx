import './App.css';
import { Link, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
      </Routes>
    </>
  );
}

export default App;
