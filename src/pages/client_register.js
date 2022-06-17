import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { AppContext } from "src/context/AppContext";
import { createClient } from "../utils/api/clients";
import { getMe } from "../utils/api/user";
import { getLocalStorage } from "../utils/helpers/localStorage";

const ClientRegister = () => {
  const [token, setToken] = useState(null);
  const { isAdmin, setIsAdmin, loguedUser, setLoguedUser } = useContext(AppContext);

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
      if (!loguedUser) {
        const { data, request } = await getMe({ token });
        if (request.ok) {
          setLoguedUser(data);
          setIsAdmin(true);
        }
      }
    }

    if (!loguedUser) {
      fetchData();
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      address: "",
      identity_card: "",
      name: "",
      phone: "",
    },
    validationSchema: Yup.object({
      identity_card: Yup.string().required("Vui lòng nhập email"),
      name: Yup.string().required("Vui lòng nhập tên"),
      phone: Yup.string().required("Vui lòng nhập số điện thoại"),
      address: Yup.string().required("Vui lòng nhập địa chỉ"),
    }),
    onSubmit: async (form) => {
      console.log("formulario cliente", form);
      const { data, request } = await createClient(token, form);
      console.log("cliente", data);

      if (request.ok) {
        router.push("/");
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
                label="Email"
                margin="normal"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name}
                variant="outlined"
              />
              <TextField
                error={Boolean(formik.touched.identity_card && formik.errors.identity_card)}
                helperText={formik.touched.identity_card && formik.errors.identity_card}
                fullWidth
                label="Tên"
                margin="normal"
                name="identity_card"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.identity_card}
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
                label="Mật khẩu"
                margin="normal"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.phone}
                variant="outlined"
              />

              <Box sx={{ py: 2 }}>
                <Button
                  color="primary"
                  disabled={formik.isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Registrar Cliente
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
