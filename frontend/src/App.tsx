import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BackofficeApp from './backoffice/BackofficeApp';
import ClientApp from './client/ClientApp';
import Login from './shared/Login';
import Register from './shared/Register';
import OwnerApplicationPage from './client/OwnerApplicationPage';
import { useAuth } from './store/AuthContext';
import LoadingSpinner from './shared/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Router>
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
    </Router>
  );
}

export default App;
