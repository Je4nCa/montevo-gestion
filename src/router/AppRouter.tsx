import { HashRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { ClientesListPage } from '@/modules/clientes/pages/ClientesListPage';
import { ClienteNuevoPage } from '@/modules/clientes/pages/ClienteNuevoPage';
import { ClienteDetailPage } from '@/modules/clientes/pages/ClienteDetailPage';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ClientesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/nuevo"
          element={
            <ProtectedRoute>
              <ClienteNuevoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/:id"
          element={
            <ProtectedRoute>
              <ClienteDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
