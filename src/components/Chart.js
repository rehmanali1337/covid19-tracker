import React, { useState, useEffect } from "react";
import { Typography, Divider, makeStyles } from "@material-ui/core";
import { Pie } from "react-chartjs-2";

const useStyles = makeStyles({
  mb: {
    marginBottom: "20px",
  },
});

const Chart = ({ code, title }) => {
  let [chartData, setChartData] = useState(false);
  let classes = useStyles();
  var numeral = require("numeral");

  async function fetchData(code) {
    let baseUrl = "https://api.thevirustracker.com/free-api?countryTotal=";
    let finalUrl = baseUrl.concat(code);
    if (code === "ALL") {
      finalUrl = "https://api.thevirustracker.com/free-api?global=stats";
    }

    let res = await fetch(finalUrl);
    let jsonRes = await res.json();

    if (code === "ALL") {
      return jsonRes.results[0];
    } else {
      return jsonRes.countrydata[0];
    }
  }

  async function createChartData(jsonRes, code) {
    let ChartData = {
      labels: ["Total Serious Cases", "Total Deaths", "Total Recovered"],
      datasets: [
        {
          data: [
            jsonRes.total_serious_cases,
            jsonRes.total_deaths,
            jsonRes.total_recovered,
          ],
          backgroundColor: ["#f3c623", "#fa1616", "#438a5e"],
          hoverBackgroundColor: ["#f3c623", "#fa1616", "#438a5e"],
        },
      ],
      total: jsonRes.total_cases,
    };
    return ChartData;
  }

  useEffect(() => {
    let countryData = fetchData(code);
    countryData
      .then((jsonRes) => {
        return createChartData(jsonRes, code);
      })
      .then((chartData) => {
        setChartData(chartData);
      });
  });

  if (chartData) {
    return (
      <>
        <Typography className={classes.mb} align="center" variant="h1">
          {title}
        </Typography>
        <Typography className={classes.mb} align="center" variant="h4">
          TOTAL CASES: {chartData.total}
        </Typography>
        <Pie data={chartData} />
      </>
    );
  } else {
    return (
      <Typography align="center" variant="h1">
        Loading Data....
      </Typography>
    );
  }
};

export default Chart;
