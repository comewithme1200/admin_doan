import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AppContext } from "src/context/AppContext";
import { createUser } from "../utils/api/user";
import { DashboardLayout } from "../components/dashboard-layout";
import { getMe, getUserById } from "../utils/api/user";
import { getLocalStorage } from "../utils/helpers/localStorage";

const ClientRegister = () => {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { isAdmin, setIsAdmin, loguedUser, setLoguedUser, userDetailId, setUserDetailId } = useContext(AppContext);

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
    const { data, request } = await getUserById(token, userDetailId);
    if (request.ok) {
        formik.setFieldValue("address", data.address);
        formik.setFieldValue("email", data.email);
        formik.setFieldValue("name", data.name);
        formik.setFieldValue("phone", data.phoneNumber);
        formik.setFieldValue("dob", data.dob);
        setUserInfo(data);
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

  console.log(userInfo);

  const formik = useFormik({
    initialValues: {
      address: "",
      email: "",
      name: "",
      phone: "",
      dob: new Date()
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Vui lòng nhập email"),
      name: Yup.string().required("Vui lòng nhập tên"),
      phone: Yup.string().required("Vui lòng nhập số điện thoại"),
      address: Yup.string().required("Vui lòng nhập địa chỉ"),
    }),
    onSubmit: async (form) => {
      console.log(JSON.stringify(form));
      if(form.password != form.re_pass) {
        alert("Sai xác nhận mật khẩu");
        return;
      }
      const { data, request } = await createUser(token, form);
      console.log("User", data);

      if (request.ok) {
        router.push("/user_list");
      }
    },
  });

  return (
    <>
      <Head>
        <title>Đăng kí thành viên</title>
      </Head>
      <DashboardLayout>
        <Box
          component="main"
          sx={{
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            minHeight: "100%",
            width: "100%",
          }}
        >
          <Container sx={{ width: "100%" }}>
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ my: 3 }}>
                <Typography color="textPrimary" variant="h4">
                  Đăng kí thành viên
                </Typography>
              </Box>
              <Grid container spacing={3}></Grid>

              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Tên"
                margin="normal"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name}
                variant="outlined"
              />
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.email}
                variant="outlined"
              />

              <TextField
                error={Boolean(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                fullWidth
                label="Địa chỉ"
                margin="normal"
                name="address"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.address}
                variant="outlined"
              />

              <TextField
                error={Boolean(formik.touched.phone && formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                fullWidth
                label="Số điện thoại"
                margin="normal"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.phone}
                variant="outlined"
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                      label="Ngày sinh"
                      value={formik.values.dob}
                      name="dob"
                      onChange={(value) => {
                          formik.setFieldValue('dob', Date.parse(value));
                          }}
                      renderInput={(params) => <TextField {...params} />}
                  />
              </LocalizationProvider>

              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Đăng kí
                </Button>
              </Box>
            </form>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default ClientRegister;
