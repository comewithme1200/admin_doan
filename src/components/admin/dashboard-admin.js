import Head from "next/head";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableContainer,
  Container,
  Grid
} from "@mui/material";
import { DashboardLayout } from "../dashboard-layout";
import { AppContext } from "../../context/AppContext";
import { getMovieTurnover, getCinemaTurnover } from "../../utils/api/statistical";
import { getLocalStorage } from "../../utils/helpers/localStorage";
import { getMe } from "../../utils/api/user";

const DashboardAdmin = () => {
  const token = getLocalStorage("token");
  const { setIsAdmin, loguedUser, setMovieTurnover, movieTurnover, cinemaTurnover, setCinemaTurnover } = useContext(AppContext);

  useEffect(() => {
    async function fetchData() {
      if (!loguedUser) {
        const { data, request } = await getMe({ token });
        if (request.ok) {
          setLoguedUser(data);
          setIsAdmin(true);
        }
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    async function fetchData() {
      if (!movieTurnover) {
        const { data, request } = await getMovieTurnover(token);
        if (request.ok) {
          setMovieTurnover(data);
        }
      }
      
      if (!cinemaTurnover) {
        const { data, request } = await getCinemaTurnover(token);
        if (request.ok) {
          setCinemaTurnover(data);
        }
      }
    };
    fetchData();
  }, [token]);

  return (
    <>
      <Head>
        <title>Dashboard Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <DashboardLayout>
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <CardHeader title="Top phim có doanh thu cao nhất"/>
              <Box sx={{ width: "100%" }}>
                <TableContainer sx={{ maxHeight: "100%", width: "100%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên phim</TableCell>
                        <TableCell>Tổng doanh thu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movieTurnover &&
                        movieTurnover.map((movie) => (
                          <TableRow hover key={movie.movie_name}>
                            <TableCell>{movie.movie_name}</TableCell>
                            <TableCell>{movie.turnOver}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <CardHeader title="Top rạp có doanh thu cao nhất"/>
              <Box sx={{ width: "100%" }}>
                <TableContainer sx={{ maxHeight: "100%", width: "100%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên rạp</TableCell>
                        <TableCell>Tổng doanh thu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cinemaTurnover &&
                        cinemaTurnover.map((cinema) => (
                          <TableRow hover key={cinema.cinema_name}>
                            <TableCell>{cinema.cinema_name}</TableCell>
                            <TableCell>{cinema.turnOver}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Container>
        </DashboardLayout>
      </Box>
    </>
  );
};

export { DashboardAdmin };
