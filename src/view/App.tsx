import React from 'react';
import './App.css';
import {Box, Grid2, Paper} from "@mui/material";
import {MyStepper} from "./components/Stepper";

function App() {
  return (
    <>
      <Paper elevation={3} className="App">
          <Grid2 container spacing={2} justifyContent="center" style={{height: "inherit"}}>
              <Grid2 size={12} >
                  <Box sx={{p: 3, textAlign: "center"}}>
                      MVP тестирование учеников
                  </Box>
              </Grid2>
              <Grid2 size={6}>
                  <MyStepper/>
              </Grid2>
          </Grid2>
      </Paper>
    </>
  );
}

export default App;
