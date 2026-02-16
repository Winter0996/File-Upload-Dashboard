import { useState } from "react";

type MockLoginProps = {
  onLogin: (token: string) => void;
};

const MockLogin = ({ onLogin }: MockLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake JWT token
    const fakeToken = btoa(username + ":" + password);
    localStorage.setItem("token", fakeToken);
    onLogin(fakeToken);
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default MockLogin;
