import React, { useEffect, useState } from "react";
import { CalendarToday } from "@mui/icons-material";

function CurrentDate() {
  const [date, setDate] = React.useState("");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = () => {
    var today = new Date();
   
    var dd = today.getDate();
    var mm = today.getMonth();
    var month = months[mm];
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var todayFormatted = dd + "-" + month + "-" + yyyy + "  " +today.toLocaleTimeString([], {timeStyle: 'short'})
    setDate(todayFormatted);
  };

  useEffect(() => {
    day();
    const varData = setInterval(day, 30 *1000);
    return () => clearInterval(varData)
  }, []);
 

  return (
    <div style={{ fontSize: "smaller" }}>
      Date-
      <CalendarToday color="primary"  fontSize="inherit" /> {date}
    </div>
  );
}

export default CurrentDate;
