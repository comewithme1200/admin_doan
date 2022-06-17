import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const Filter = ({ fields, onFilter, onClear, handleAdd }) => {
  const [query, setQuery] = useState({});

  const handleChange = (field, event) => {
    setQuery({ ...query, [field]: event.target.value });
    console.log(query);
  };
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "50ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Typography gutterBottom variant="overline" sx={{ fontSize: "0.8rem" }}>
            Tìm kiếm
          </Typography>
        </Grid>
      </Grid>
      {fields &&
        fields.map((field) => (
          <TextField
            key={field.field}
            label={field.title}
            variant="outlined"
            onChange={(event) => handleChange(field.field, event)}
          />
        ))}
      <Grid item lg={12} sm={6} xl={3} xs={12}>
        <Button size="medium" variant="contained" onClick={() => onFilter(query)}>
          Tìm kiếm
        </Button>
        <Button size="medium" variant="contained" onClick={onClear} sx={{ margin: 1 }}>
          Clear
        </Button>
        <Button size="medium" variant="contained" onClick={handleAdd}>
          Thêm mới
        </Button>
      </Grid>
    </Box>
  );
};

export { Filter };
