import { useEffect } from "react";
import { useUser } from "../context/user";

const Login = () => {
  const { login } = useUser();

  useEffect(login, []);

  return <h1>Logging in...</h1>;
};

export default Login;
