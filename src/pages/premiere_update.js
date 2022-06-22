import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import { AppContext } from "src/context/AppContext";
import { getMe } from "../utils/api/user";
import { getRooms } from "../utils/api/rooms";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getMovies, getMovieById } from "src/utils/api/movies";
import { updatePremiere, getPremiereDetail } from "src/utils/api/premiere";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

const premiere_update = () => {
    const [token, setToken] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const [movieId, setMovieId] = useState(null);
    const [premiereDetail, setPremiereDetail] = useState(null);
    const { isAdmin, setIsAdmin, loguedUser, setLoguedUser, movies, setMovies, rooms, setRooms, premiereDetailId } = useContext(AppContext);
  
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
        const { request, data } = await getMovies(null);
        if (request.ok) {
            setMovies(data);
        }

        if (!premiereDetail) {
            const { request, data } = await getPremiereDetail(premiereDetailId);
            if (request.ok) {
                formik.setFieldValue("room_name", data.room_id);
                formik.setFieldValue("movie_name", data.movie_id);
                formik.setFieldValue("start_time", new Date(data.start_time));
                formik.setFieldValue("end_time", new Date (data.end_time));
                setMovieId(data.movie_id);
                setRoomId(data.room_id);
                setPremiereDetail(data);
            }
        }
        
        if (!rooms) {
          const { request, data } = await getRooms();
          if (request.ok) {
              setRooms(data);
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
  
      fetchData();
    }, [token]);
  
    const formik = useFormik({
      initialValues: {
        room_name: "",
        movie_name: "",
        start_time: new Date(),
        end_time: new Date()
      },
      validationSchema: Yup.object({
        movie_name: Yup.string().required("Vui lòng chọn phim"),
        room_name: Yup.string().required("Vui lòng chọn phòng chiếu"),
        start_time: Yup.string().required("Vui lòng chọn thời điểm bắt đầu"),
        end_time: Yup.string().required("Vui lòng chọn thời điểm kết thúc"),
      }),
      onSubmit: async (form) => {
        console.log("Form", form);
        const { data, request } = await getMovieById(token, movieId);
        const diff = form.start_time.getTime() - form.end_time.getTime();
        const minDiff = Math.round(diff / 60000);
        console.log(minDiff, data.time);
        if (Math.abs(minDiff) < data.time) {
          alert("Thời gian suất chiếu ngắn hơn thời lượng phim");
        } else {
          const { data, request } = await updatePremiere(token, form, movieId, roomId, premiereDetailId);
          if (request.ok) {
            router.push("/premiere_list");
          } else {
            alert(data.message);
          }
        }
      },
    });

    return (
      <>
        <Head>
          <title>Thêm suất chiếu</title>
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
                    Thêm suất chiếu
                  </Typography>
                </Box>
                <Stack spacing={3}>
                    <Select
                        name="room_name"
                        value={formik.values.room_name}
                        label="Phòng"
                        onChange={e => {
                          console.log(e.target);
                          formik.setFieldValue("room_name", e.target.value);
                          setRoomId(e.target.value);
                        }}
                    >
                        {rooms && rooms.map((room) => (
                            <MenuItem
                            key={room.id}
                            value={room.id}
                            >
                            {room.room_name + "(" + room.cinema_name + ")"}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        name="movie_name"
                        value={formik.values.movie_name}
                        label="Phim"
                        onChange={e => {
                          formik.setFieldValue("movie_name", e.target.value);
                          setMovieId(e.target.value);
                        }}
                    >
                        {movies && movies.map((movie) => (
                            <MenuItem
                            key={movie.id}
                            value={movie.id}
                            >
                            {movie.movie_name}
                            </MenuItem>
                        ))}
                    </Select>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Thời gian bắt đầu"
                            value={formik.values.start_time}
                            name="start_time"
                            onChange={(value) => {
                                formik.setFieldValue('start_time', value);
                                }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DateTimePicker
                            label="Thời gian kết thúc"
                            value={formik.values.end_time}
                            name="end_time"
                            onChange={(value) => {
                                formik.setFieldValue('end_time', value);
                                }}
                            renderInput={(params) => <TextField {...params} />
                            }
                        />
                    </LocalizationProvider>
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

export default premiere_update;