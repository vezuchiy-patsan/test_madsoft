import {useState} from 'react';
import './App.css';
import {Box, Grid2, Paper} from "@mui/material";
import {MyStepper} from "./components/Stepper";
import {CountDown} from "./components/CountDown";

function App() {
    const [time, setTime] = useState<number>(20);
    const [timeOut, setTimeOut] = useState<boolean>(false);

  return (
    <>
      <Paper elevation={3} className="App" style={{  display: "flex", justifyContent: "center",
          alignItems: "center"}}>
          <Grid2 container spacing={2}  justifyContent="center" >
              <Grid2 size={12} >
                  <Box sx={{p: 3, textAlign: "center"}}>
                      MVP тестирование учеников
                  </Box>
              </Grid2>
              <Grid2 container size={6} justifyContent="center">
                  <Grid2 size={2}>
                      <CountDown time={time} setTimeOut={setTimeOut} />
                  </Grid2>
                  <Grid2 size={12} justifyContent="center">
                      <MyStepper isTimeOut={timeOut}/>
                  </Grid2>
              </Grid2>

          </Grid2>
      </Paper>
    </>
  );
}

export default App;
