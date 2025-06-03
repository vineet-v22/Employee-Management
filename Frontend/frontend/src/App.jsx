import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeList from './pages/EmployeeList';
import Upload from './pages/Upload';
import ProtectedRoute from './components/protectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}