import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      console.log(data.userId);
      if (response.ok) {
        setMessage('Login successful!');
        navigate('/search');

        // -------- gpt timeout --------
        // Store token or handle authenticated state here
        // setTimeout(() => {
        //     navigate('/search');
        // }, 500); // Redirect to search book page after 2 seconds
        // -------- gpt timeout --------
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const goToRegisterPage = () => {
    navigate(`/register`);
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <button onClick={goToRegisterPage}>No account? Register here</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
