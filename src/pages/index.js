import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "src/context/AppContext";
import { getSales, getAllSales } from "../utils/api/sales";
import { getClients } from "../utils/api/clients";
import { getMovies } from "../utils/api/movies";
import { ClientsList } from "../components/dashboard/clients-list";
import { DashboardAdmin } from "../components/admin/dashboard-admin";
import { DashboardSalesman } from "../components/salesman/dashboard-salesman";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { getMe } from '../utils/api/user'

const Dashboard = () => {
  const {
    isAdmin,
    clients,
    setClients,
    products,
    setMovies,
    loguedUser,
    setLoguedUser,
    sales,
    setSales,
    salesCount,
    setSalesCount,
    setIsAdmin,
  } = useContext(AppContext);

  const [pageSales, setPageSales] = useState(0);
  const [pageProducts, setPageProducts] = useState(0);
  const [pageClients, setPageClients] = useState(0);
  const [allSales, setAllSales] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const aux = getLocalStorage("token");
    if (!aux) {
      router.push("/login");
    }
    setToken(aux);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!loguedUser) {
        const { data, request } = await getMe({ token });
        if (request.ok) {
          setLoguedUser(data);
          console.log('ES ADMIN')
            setIsAdmin(true);
        }
      }
    }

    if (token && !loguedUser) {
      fetchData();
    }


  }, [token]);


  useEffect(() => {
    if(loguedUser) {
      console.log('uwu')
      setLoading(false);
    }
  }, [loguedUser])


  const handlePageChangeSales = async (event, newPage) => {
    setPageSales(newPage);
    const newUrl = newPage > pageSales ? sales.next : sales.previous;
    const { data, request } = await getSales(token, newUrl);
    setSales(data);
  };

  const handlePageChangeProducts = async (event, newPage) => {
    const newUrl = newPage > pageProducts ? products.next : products.previous;
    setPageProducts(newPage);
    const { data, request } = await getMovies(token, newUrl);
    setMovies(data);
  };

  const handlePageChangeClients = async (event, newPage) => {
    setPageClients(newPage);
    const newUrl = newPage > pageClients ? clients.next : clients.previous;
    const { data, request } = await getSales(token, newUrl);
    setClients(data);
  };

  return (
    <>
      <DashboardAdmin />  
    </>
  );
};

export default Dashboard;
