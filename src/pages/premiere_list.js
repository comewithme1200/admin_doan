import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
import { SeverityPill } from "../components/severity-pill";
import { getPremieres } from "../utils/api/premiere";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { Filter } from "../components/filter";
import { getMe } from "../utils/api/user";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

const SalesList = (props) => {
  const { premieres, setPremieres, isAdmin, loguedUser, setLoguedUser, setIsAdmin, setPremiereDetailId } =
  useContext(AppContext);
const [page, setPage] = useState(0);
const [token, setToken] = useState(null);
const [filteredPremieres, setFilteredPremieres] = useState([]);
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
    const { data, request } = await getPremieres(null);
    if (request.ok) {
      setPremieres(data);
    }
    
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
  setFilteredPremieres(premieres);
}, [premieres]);

const handleFilter = async (query) => {
  console.log("query")
  let aux = "";
  console.log(query);
  Object.entries(query).forEach((element) => {
    aux = aux + `${element[0]}=${element[1]}`;
  });
  console.log("aux", aux);

  const { data, request } = await getPremieres(aux);
  if (request.ok) {
    setFilteredPremieres(data);
  }
  console.log("filtered results", data);
};

const handleClear = () => {
  setFilteredPremieres(premieres);
};

const handlePageChange = async (event, newPage) => {
  const newUrl = newPage > page ? premieres.next : premieres.previous;
  setPage(newPage);
  const { data, request } = await getPremieres(token, newUrl);
  setPremieres(data);
};

const handleDelete = async (id) => {
  console.log(id);
}

const handleUpdate = async (id) => {
  setPremiereDetailId(id);
  router.push("/premiere_update")
  console.log(id);
}

const handleAdd = () => {
  router.push("/premiere_add")
}


return (
  <>
    <Head>
      <title>Danh sách suất chiếu</title>
    </Head>
  <DashboardLayout>
    <Card {...props}>
      <CardHeader title="Danh sách suất chiếu"/>
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
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell>Tên phim</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Rạp</TableCell>
                <TableCell>Vô hiệu</TableCell>
                <TableCell>Chức năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPremieres &&
                filteredPremieres.map((premiere) => (
                  <TableRow hover key={premiere.id}>
                    <TableCell>{new Date(premiere.start_time).toLocaleDateString("en-US") + " " + new Date(premiere.start_time).toLocaleTimeString("en-US")}</TableCell>
                    <TableCell>{new Date(premiere.end_time).toLocaleDateString("en-US") + " " + new Date(premiere.end_time).toLocaleTimeString("en-US")}</TableCell>
                    <TableCell>{premiere.movie_name}</TableCell>
                    <TableCell>{premiere.room_name}</TableCell>
                    <TableCell>{premiere.cinema_name}</TableCell>
                    <TableCell>{premiere.disabled === "t" ? <CheckIcon fontSize="small" /> : ""}</TableCell>
                    <TableCell>
                      <Grid item lg={12} sm={6} xl={3} xs={12} sx={{width: "50ch"}}>
                        {premiere.disabled === "f" && (
                          <Button size="medium" variant="contained" onClick={() => handleUpdate(premiere.id)}>
                            <EditIcon fontSize="small" />
                          </Button>
                        )}
                      </Grid>     
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {premieres && (
                  <TablePagination
                    colSpan={3}
                    count={premieres.length}
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

export default SalesList;
