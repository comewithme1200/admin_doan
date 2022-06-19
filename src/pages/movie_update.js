import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Input, TextField, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { AppContext } from "src/context/AppContext";
import { getMe } from "../utils/api/user";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { updateMovie, getMovieById } from "src/utils/api/movies";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Stack from '@mui/material/Stack';


const movie_update = () => {
    const [token, setToken] = useState(null);
    const [movie, setMovie] = useState(null);
    const { isAdmin, setIsAdmin, loguedUser, setLoguedUser, movieDetailId, setMovieDetailId } = useContext(AppContext);
  
    const router = useRouter();
    useEffect(() => {
      const aux = getLocalStorage("token");
      setToken(getLocalStorage("token"));
      if (!aux) {
        router.push("/login");
      }
    }, []);
  
    console.log(movieDetailId);
    useEffect(() => {
      async function fetchData() {
        console.log(movieDetailId);
        const { data, request } = await getMovieById(token, movieDetailId);
        if (request.ok) {
          setMovie(data);
        }
        if (!loguedUser) {
          const { data, request } = await getMe({ token });
          if (request.ok) {
            setLoguedUser(data);
            setIsAdmin(true);
          }
        }
      }
  
      if (!loguedUser || !movie) {
        fetchData();
      }
    }, [token]);
  
    const formik = useFormik({
      initialValues: {
        movie_name: "",
        premiere_date: new Date(),
        detail: "",
        trailer_link: "",
        image: "",
        time: 0
      },
      validationSchema: Yup.object({
        movie_name: Yup.string().required("Vui lòng nhập tên phim"),
        premiere_date: Yup.string().required("Vui lòng chọn ngày công chiếu"),
        detail: Yup.string().required("Vui lòng nhập chi tiết phim"),
        time: Yup.string().required("Vui lòng nhập thời lượng phim")
      }),
      onSubmit: async (form) => {
        console.log("formulario cliente", form);
        const { data, request } = await updateMovie(token, form);
        console.log("cliente", data);
  
        if (request.ok) {
          router.push("/movies_list");
        }
      },
    });
  
    return (
      <>
        <Head>
          <title>Cập nhật phim</title>
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
                    Cập nhật phim
                  </Typography>
                </Box>
                <Stack spacing={3}>
                  <TextField
                    error={Boolean(formik.touched.movie_name && formik.errors.movie_name)}
                    fullWidth
                    helperText={formik.touched.movie_name && formik.errors.movie_name}
                    label="Tên phim"
                    margin="normal"
                    name="movie_name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.movie_name}
                    variant="outlined"
                    defaultValue={movie?.movie_name}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          label="Thời gian công chiếu"
                          value={formik.values.premiere_date}
                          name="premiere_date"
                          onChange={(value) => {
                              formik.setFieldValue('premiere_date', Date.parse(value));
                              }}
                          renderInput={(params) => <TextField {...params} />}
                          defaultValue={Date.parse(movie?.premiere_date)}
                      />
                  </LocalizationProvider>
                  <TextareaAutosize
                    helperText={formik.touched.detail && formik.errors.detail}
                    placeholder="Chi tiết phim"
                    style={{ width: 1150, height: 500 }}
                    name="detail"
                    onChange={formik.handleChange}
                    defaultValue={movie?.detail}
                  />
                  <TextField
                    fullWidth
                    label="Link trailer"
                    margin="normal"
                    name="trailer_link"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.trailer_link}
                    variant="outlined"
                    defaultValue={movie?.trailer_link}
                  />
                  <TextField
                    fullWidth
                    label="Thời lượng"
                    margin="normal"
                    name="time"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.time}
                    variant="outlined"
                    defaultValue={movie?.time}
                  />
                  <Input 
                    type="file"
                    name="image"
                    onChange={(event) => {
                      formik.setFieldValue('image', event.target)
                    }}
                  />
                </Stack>
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Thêm mới
                  </Button>
                </Box>
              </form>
            </Container>
          </Box>
        </DashboardLayout>
      </>
    );
  };  

export default movie_update;