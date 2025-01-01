import { useSelector } from "react-redux";
import Login from "./components/Login";
import Posts from "./components/Posts";

function App() {
  const token = useSelector((state: any) => state.auth.token);
  return (
    <>
      {!token && <Login />}
      {token && <Posts />}
    </>
  );
}

export default App;
