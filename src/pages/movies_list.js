import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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
} from "@mui/material";
import { AppContext } from "../context/AppContext";
import { DashboardLayout } from "../components/dashboard-layout";
import { getMovies } from "../utils/api/movies";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { Filter } from "../components/filter";
import { getMe } from "../utils/api/user";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MoviesList = (props) => {
  const { movies, setMovies, isAdmin, loguedUser, setLoguedUser, setIsAdmin } =
    useContext(AppContext);
  const [page, setPage] = useState(0);
  const [token, setToken] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    const aux = getLocalStorage("token");
    setToken(getLocalStorage("token"));
    if (!aux) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!movies) {
        const { data, request } = await getMovies(null);
        if (request.ok) {
          setMovies(data);
        }
      }
      if (!loguedUser) {
        const { data, request } = await getMe({ token });
        if (request.ok) {
          setLoguedUser(data);
          setIsAdmin(true);
        }
      }
    }

    if (!movies || !loguedUser) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    setFilteredMovies(movies);
  }, [movies]);

  const handleFilter = async (query) => {
    let aux = "";
    console.log(query);
    Object.entries(query).forEach((element) => {
      aux = aux + `${element[0]}=${element[1]}`;
    });
    console.log("aux", aux);

    const { data, request } = await getMovies(token, null, aux);
    if (request.ok) {
      setFilteredMovies(data);
    }
    console.log("filtered results", data);
  };

  const handleClear = () => {
    setFilteredMovies(movies);
  };

  const handlePageChange = async (event, newPage) => {
    const newUrl = newPage > page ? movies.next : movies.previous;
    setPage(newPage);
    const { data, request } = await getMovies(token, newUrl);
    setMovies(data);
  };

  const handleDelete = async (id) => {
    console.log(id);
  }

  const handleUpdate = async (id) => {
    console.log(id);
  }

  const handleAdd = async => {
    router.push("/movie_add")
  }


  return (
    <>
      <Head>
        <title>Danh sách phim</title>
      </Head>
    <DashboardLayout>
      <Card {...props}>
        <CardHeader title="Danh sách phim"/>
        <Box sx={{ width: "100%" }}>
          <Filter
            fields={[
              { title: "Tìm kiếm", field: "query", type: "text" }
            ]}
            onFilter={handleFilter}
            onClear={handleClear}
            handleAdd={handleAdd}
          ></Filter>
          <TableContainer sx={{ maxHeight: "100%", width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên phim</TableCell>
                  <TableCell>Ngày khởi chiếu</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Link trailer</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Thời lượng</TableCell>
                  <TableCell>Chức năng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovies &&
                  filteredMovies.map((movie) => (
                    <TableRow hover key={movie.id}>
                      <TableCell>{movie.movie_name}</TableCell>
                      <TableCell>{new Date(movie.premiere_date).toLocaleDateString("en-US")}</TableCell>
                      <TableCell>{movie.detail}</TableCell>
                      <TableCell>{movie.trailer_link}</TableCell>
                      <TableCell><img src={movie.image_path} style={{height: "250px", width: "auto"}}></img></TableCell>
                      <TableCell>{movie.time}</TableCell>
                      <TableCell>
                        <Grid item lg={12} sm={6} xl={3} xs={12} sx={{width: "50ch"}}>
                          <Button size="medium" variant="contained" onClick={() => handleUpdate(movie.id)}>
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button size="medium" variant="contained" onClick={() => handleDelete(movie.id)} sx={{ margin: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Grid>          
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  {movies && (
                    <TablePagination
                      colSpan={3}
                      count={movies.length}
                      rowsPerPage={10}
                      onPageChange={handlePageChange}
                      page={page}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      }}
                    />
                  )}
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        ></Box>
      </Card>
    </DashboardLayout></>
  );
};

export default MoviesList;
