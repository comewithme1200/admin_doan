import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useRouter } from "next/router";

const Logout = () => {
  const {
    setToken,
    setIsAdmin,
    setSales,
    setUserSales,
    setMovies,
    setClients,
    setLoguedUser,
    setSalesmans,
    setSalesCount,
    setPremieres
  } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setToken("");
    setIsAdmin(false);
    setSales(null);
    setUserSales(null);
    setMovies(null);
    setClients(null);
    setLoguedUser(null);
    setSalesmans(null);
    setSalesCount(null);
    setPremieres(null);
    router.push("/login");
  }, []);

  return <></>;
};

export default Logout;
