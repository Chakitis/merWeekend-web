import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Login.css';
import config from '../config';

interface LoginProps {
  setAuth: (auth: boolean) => void;
}

const Login = ({ setAuth }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/auth/login`, { username, password });
      const { token } = response.data;

      // Uložení tokenu do sessionStorage
      sessionStorage.setItem('token', token);

      setAuth(true);
      navigate('/');
    } catch (err) {
      setError('Nesprávné přihlašovací údaje!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Přihlášení</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Login:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Zadejte uživatelské jméno"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Heslo:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zadejte heslo"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Přihlásit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;