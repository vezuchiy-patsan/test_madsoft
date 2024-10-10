import {Box} from "@mui/material";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

interface ICountDownProps {
    time: number,
    setTimeOut: Dispatch<SetStateAction<boolean>>
}

export function CountDown ({time, setTimeOut}: ICountDownProps) {
    const [timeLeft, setTimeLeft] = useState<Date>(new Date(0o000,0,0, 0, time, 0));

    useEffect(() => {
        if(timeLeft.getMinutes() === 0 && timeLeft.getSeconds() === 0) {
            setTimeOut(true);
            return ;
        }
        const timer = setTimeout(() => {
            if (timeLeft !== null) {
                setTimeLeft(new Date(timeLeft.getTime() - 1000));
            }
        }, 1000);

        return () => clearTimeout(timer);

    }, [timeLeft]);

    const minutes = Math.floor(timeLeft?.getMinutes() || 0);
    const seconds = Math.floor((timeLeft?.getSeconds() || 0) % 60);

    return(
      <Box component="div" sx={{border: "1px solid #007FFF", borderRadius: 1, p: 1, m: "10px 0 20px 0" }}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </Box>
    );
}
