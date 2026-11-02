import React, { useEffect, useState } from "react";
import { DateRange } from "@mui/icons-material";

function CurrentWeek() {
  const [weekNo, setWeekNo] = React.useState("");

  useEffect(() => {
    async function fetchData() {
      week();
    }
    fetchData();
  }, []);

  const week = () => {


    // currentdate = new Date();
    // var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    // var numberOfDays = Math.floor(
    //   (currentdate - oneJan) / (24 * 60 * 60 * 1000)
    // );
    // var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);

    var dowOffset = 1; // typeof dowOffset == "number" ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(new Date().getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = day >= 0 ? day : day + 7;
    var daynum =
      Math.floor(
        (new Date().getTime() -
          newYear.getTime() -
          (new Date().getTimezoneOffset() - newYear.getTimezoneOffset()) *
          60000) /
        86400000
      ) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    //if (day < 4)
    //{     
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(new Date().getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
            the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
    //}
    // else {  
    //   weeknum = Math.floor((daynum + day - 1) / 7);
    // }

    if (weeknum < 10) {
      weeknum = "0" + weeknum;
    }
    var result = +newYear.getFullYear() + "-" + weeknum;
    setWeekNo(result);
  };

  return (
    <div style={{ fontSize: "smaller" }}>
      Week-
      <DateRange color="primary" fontSize="inherit" /> {weekNo}
    </div>
  );
}

export default CurrentWeek;
