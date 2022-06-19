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
import { getLocalStorage } from "../utils/helpers/localStorage";
import { Filter } from "../components/filter";
import { getMe, getAdmin } from "../utils/api/user";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const UserList = (props) => {
  const { Admins, setAdmins, isAdmin, loguedUser, setLoguedUser, setIsAdmin, adminList, setAdminList, userDetailId, setUserDetailId } =
    useContext(AppContext);
  const [page, setPage] = useState(0);
  const [token, setToken] = useState(null);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  
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
        const { data, request } = await getAdmin({ token });
        if (request.ok) {
          setAdminList(data);
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
    setFilteredAdmins(adminList);
  }, [adminList]);

  const handleFilter = async (query) => {
    let aux = "";
    console.log(query);
    Object.entries(query).forEach((element) => {
      aux = aux + `${element[0]}=${element[1]}`;
    });
    console.log("aux", aux);

    const { data, request } = await getAdmin(token, aux);
    if (request.ok) {
      setFilteredAdmins(data);
    }
    console.log("filtered results", data);
  };

  const handleClear = () => {
    setFilteredAdmins(Admins);
  };

  const handleDelete = async (id) => {

    console.log(id);
  }

  const handleUpdate = async (id) => {
    setUserDetailId(id);
    router.push("/user_update");
    console.log(id);
  }

  const handleAdd = async => {
    router.push("/client_register")
  }


  return (
    <>
      <Head>
        <title>Danh sách Admin</title>
      </Head>
    <DashboardLayout>
      <Card {...props}>
        <CardHeader title="Danh sách admin"/>
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
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày sinh nhật</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Chức năng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAdmins &&
                  filteredAdmins.map((admin) => (
                    <TableRow hover key={admin.id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.phoneNumber ? admin.phoneNumber : ""}</TableCell>
                      <TableCell>{admin.dob ? admin.dob : ""}</TableCell>
                      <TableCell>{admin.address ? admin.address : ""}</TableCell>
                      <TableCell>
                        <Grid item lg={12} sm={6} xl={3} xs={12} sx={{width: "50ch"}}>
                          <Button size="medium" variant="contained" onClick={() => handleUpdate(admin.id)}>
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button size="medium" variant="contained" onClick={() => handleDelete(admin.id)} sx={{ margin: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Grid>          
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
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

export default UserList;
