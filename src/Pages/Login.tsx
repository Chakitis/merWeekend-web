import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
// import { loginAdmin } from '../utils/auth';

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
      // const token = await loginAdmin(username, password);
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
            <label htmlFor="username">Uživatelské jméno:</label>
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