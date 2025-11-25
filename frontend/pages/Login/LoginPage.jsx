import { useState } from 'react';
import { apiFetch } from '../../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch('/sessions', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // redirecionar...
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
      {error && <p>Erro: {String(error.message || error)}</p>}
    </form>
  );
}
