import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ContractsPage from './pages/ContractsPage';
import ContractFormPage from './pages/ContractFormPage';
import ContractDetailsPage from './pages/ContractDetailsPage';

export default function App() {
  const user = useMemo(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout user={user}>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/contracts" element={<ContractsPage user={user} />} />
                <Route path="/contracts/new" element={<ContractFormPage isEdit={false} />} />
                <Route path="/contracts/:id" element={<ContractDetailsPage />} />
                <Route path="/contracts/:id/edit" element={<ContractFormPage isEdit={true} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
