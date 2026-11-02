import React, { useEffect, useState } from "react";
import { CalendarToday } from "@mui/icons-material";

function CurrentDateOnly() {
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
    var todayFormatted = dd + "-" + month + "-" + yyyy;
    setDate(todayFormatted);
  };

  setInterval(day, 30 *1000); //60 secs

  function stopFunction() {   
    clearInterval(day);
  }


  useEffect(() => {
    async function fetchData() {
      day();
    }
    fetchData();
    return () => {
      stopFunction();
  }
  }, []);



 

  return (
    <div style={{ fontSize: "smaller" }}>
     
     Total Risk Identified till date {date}
    </div>
  );
}

export default CurrentDateOnly;
