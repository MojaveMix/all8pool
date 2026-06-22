import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './store/AuthContext';
import LoadingSpinner from './shared/LoadingSpinner';
import LanguageSwitcher from './shared/LanguageSwitcher';

const BackofficeApp = lazy(() => import('./backoffice/BackofficeApp'));
const ClientApp = lazy(() => import('./client/ClientApp'));
const Login = lazy(() => import('./shared/Login'));
const Register = lazy(() => import('./shared/Register'));
const OwnerApplicationPage = lazy(() => import('./client/OwnerApplicationPage'));

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Router>
      <div className="relative">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/apply-owner" element={<OwnerApplicationPage />} />

            {/* Backoffice Routes */}
            <Route
              path="/backoffice/*"
              element={user?.role === 'owner' || user?.role === 'admin' ? <BackofficeApp /> : <Navigate to="/login" />}   
            />

            {/* Client Web App Routes */}
            <Route path="/*" element={<ClientApp />} />
          </Routes>
        </Suspense>
        
        {/* Global Language Switcher */}
        <div className="fixed bottom-4 right-4 z-[9999] shadow-2xl rounded-xl">
          <LanguageSwitcher />
        </div>
      </div>
    </Router>
  );
}

export default App;
