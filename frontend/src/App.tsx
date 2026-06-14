import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BackofficeApp from './backoffice/BackofficeApp';
import ClientApp from './client/ClientApp';
import Login from './shared/Login';
import Register from './shared/Register';
import { useAuth } from './store/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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
