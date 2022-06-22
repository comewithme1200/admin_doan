import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, Input, TextField, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { AppContext } from "src/context/AppContext";
import { getMe } from "../utils/api/user";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { updateMovie, getMovieById, updateMovieWithout } from "src/utils/api/movies";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Stack from '@mui/material/Stack';


const movie_update = () => {
    const [token, setToken] = useState(null);
    const [movie, setMovie] = useState(null);
    const [preview, setPreview] = useState(null);
    const { isAdmin, setIsAdmin, loguedUser, setLoguedUser, movieDetailId, setMovieDetailId } = useContext(AppContext);
  
    const router = useRouter();

    const imageHandler = (e) => {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        if(reader.readyState === 2) {
          setPreview(reader.result)
        }
      }
      console.log(preview);
      console.log(reader);
    }

    useEffect(() => {
      const aux = getLocalStorage("token");
      setToken(getLocalStorage("token"));
      if (!aux) {
        router.push("/login");
      }
    }, []);
  
    useEffect(() => {
      async function fetchData() {
        const { data, request } = await getMovieById(token, movieDetailId);
        if (request.ok) {
          formik.setFieldValue("movie_name", data.movie_name);
          formik.setFieldValue("premiere_date", new Date(data.premiere_date));
          formik.setFieldValue("detail", data.detail);
          formik.setFieldValue("trailer_link", data.trailer_link);
          formik.setFieldValue("image_path", data.image_path);
          formik.setFieldValue("time", data.time);
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
        image_path:"",
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
        if (form.image === '') {
          const request = await updateMovieWithout(token, form, movieDetailId);
          if (request.ok) {
            router.push("/movies_list");
          }
        } else {
          const request = await updateMovie(token, form, movieDetailId);
          console.log(request);
          if (request.ok) {
            router.push("/movies_list");
          }
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
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          label="Thời gian công chiếu"
                          value={formik.values.premiere_date}
                          name="premiere_date"
                          onChange={(value) => {
                              formik.setFieldValue('premiere_date', new Date(value).getTime());
                              }}
                          renderInput={(params) => <TextField {...params} />}
                      />
                  </LocalizationProvider>
                  <TextareaAutosize
                    helperText={formik.touched.detail && formik.errors.detail}
                    placeholder="Chi tiết phim"
                    style={{ width: 1150, height: 500 }}
                    name="detail"
                    value={formik.values.detail}
                    onChange={formik.handleChange}
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
                  />
                  <Grid>
                    <Input 
                      type="file"
                      name="image"
                      onChange={(event) => {
                        formik.setFieldValue('image', event.target)
                        formik.setFieldValue('image_path', null)
                        imageHandler(event)
                      }}
                    />
                    <img src={formik.values.image_path ? formik.values.image_path : preview}></img>
                  </Grid>
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
                    Cập nhật
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