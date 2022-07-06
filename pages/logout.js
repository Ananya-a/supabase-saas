import { useEffect } from "react";
import { useUser } from "../context/user";

const Logout = () => {
  const { logout } = useUser();

  useEffect(logout, []);

  return <h1>Logging out</h1>;
};

export default Logout;
