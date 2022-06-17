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
import { getRooms } from "../utils/api/rooms";
import { getLocalStorage } from "../utils/helpers/localStorage";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getMovies } from "src/utils/api/movies";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

const premiere_add = () => {
    const [token, setToken] = useState(null);
    const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));
    const { isAdmin, setIsAdmin, loguedUser, setLoguedUser, movies, setMovies, rooms, setRooms } = useContext(AppContext);
  
    const router = useRouter();
    useEffect(() => {
      const aux = getLocalStorage("token");
      setToken(getLocalStorage("token"));
      console.log("Chạy login effect");
      if (!aux) {
        router.push("/login");
      }
    }, []);
  
    useEffect(() => {
      async function fetchData() {
        console.log("Chạy effect");
        const { data, request } = await getMovies(null);
        if (request.ok) {
            setMovies(data);
        }
        
        const { roomData, roomRequest } = await getRooms();
        if (roomRequest.ok) {
            setRooms(roomData);
        }
        
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
        //const { data, request } = await createClient(token, form);
        //console.log("cliente", data);
  
        if (request.ok) {
          router.push("/");
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
                        label="Age"
                        onChange={(value) => {
                            formik.setFieldValue('room_name', value);
                        }}
                    >
                        {rooms && rooms.map((room) => (
                            <MenuItem
                            key={room.id}
                            value={room.room_name}
                            >
                            {room.room_name}
                            </MenuItem>
                        ))}
                    </Select>

                    <Select
                        name="movie_name"
                        value={formik.values.movie_name}
                        label="Phim"
                        onChange={(value) => {
                            formik.setFieldValue('movie_name', value);
                        }}
                    >
                        {movies && movies.map((movie) => (
                            <MenuItem
                            key={movie.id}
                            value={movie.movie_name}
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
                                formik.setFieldValue('start_time', Date.parse(value));
                                }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DateTimePicker
                            label="Thời gian kết thúc"
                            value={formik.values.end_time}
                            name="end_time"
                            onChange={(value) => {
                                formik.setFieldValue('end_time', Date.parse(value));
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

export default premiere_add;