import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      'http://localhost:8000/auth/login',
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(res.data.access_token);
    localStorage.setItem('token', res.data.access_token);
    navigate('/employees');
  } catch (err) {
    alert('Invalid credentials');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-bold">Login</h2>
        <input type="text" className="w-full p-2 border" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" className="w-full p-2 border" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}