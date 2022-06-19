import React, { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [value, setValue] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [sales, setSales] = useState(null);
  const [userSales, setUserSales] = useState(null);
  const [movies, setMovies] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [premieres, setPremieres] = useState(null);
  const [clients, setClients] = useState(null);
  const [movieTurnover, setMovieTurnover] = useState(null);
  const [movieDetailId, setMovieDetailId] = useState(null);
  const [userDetailId, setUserDetailId] = useState(null);
  const [cinemaTurnover, setCinemaTurnover] = useState(null);
  const [adminList, setAdminList] = useState(null);
  const [loguedUser, setLoguedUser] = useState(null);
  const [salesmans, setSalesmans] = useState(null);
  const [salesCount, setSalesCount] = useState(null);
  const [orders, setOrders] = useState(null);
  const [ordersCount, setOrdersCount] = useState(null);


  useEffect(() => {
    setValue({
      orders,
      setOrders,
      token,
      setToken,
      isAdmin,
      setIsAdmin,
      sales,
      setSales,
      userSales,
      setUserSales,
      movies,
      setMovies,
      premieres,
      setPremieres,
      rooms,
      setRooms,
      movieTurnover,
      setMovieTurnover,
      cinemaTurnover,
      setCinemaTurnover,
      adminList,
      setAdminList,
      movieDetailId,
      setMovieDetailId,
      userDetailId,
      setUserDetailId,
      clients,
      setClients,
      loguedUser,
      setLoguedUser,
      salesmans,
      setSalesmans,
      salesCount,
      setSalesCount,
      ordersCount,
      setOrdersCount,
    });
  }, [token, isAdmin, sales, userSales, movies, adminList, premieres, movieDetailId, userDetailId, rooms, movieTurnover, cinemaTurnover, clients, loguedUser, salesmans, salesCount, orders, ordersCount]);


  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
