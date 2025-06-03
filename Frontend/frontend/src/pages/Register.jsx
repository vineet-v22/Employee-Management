import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/auth/register', {
        username,
        password,
        role,
      });
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold">Register</h2>
        <input type="text" className="w-full p-2 border" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" className="w-full p-2 border" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="w-full p-2 border" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
