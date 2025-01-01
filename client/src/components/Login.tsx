import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../apiSlice/authSlice";
import { useLoginMutation, useRegisterMutation } from "../apiSlice/postsApiSlice";

const Login = () => {
  const [username, setUsername] = useState("vistyle");
  const [password, setPassword] = useState("Mini@1985");
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      await register({
        username,
        password,
      }).unwrap();
    } catch (err) {
      console.error("Failed to Register: ", err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await login({
        username,
        password,
      }).unwrap();
      dispatch(setToken(res.token));
    } catch (err) {
      console.error("Failed to Login: ", err);
    }
  };
  return (
    <>
      <div style={{ marginBottom: "1rem", padding: "1rem", width: "50%", border: "1px solid #ccc" }}>
        <label htmlFor="username">Username: </label>
        <input id="username" type="text" placeholder="Uername" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <br />
        <button onClick={handleRegister}>Register</button> ||
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
};

export default Login;
