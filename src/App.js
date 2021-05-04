import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 30.80746, lng: 89.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");
  const [mapCountires, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://corona.lmao.ninja/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setInputCountry("worldwide");
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://corona.lmao.ninja/v3/covid-19/countries")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setInputCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>Shahed's Covid-19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Corona Virus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases + " Total"}
          ></InfoBox>
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered + " Total"}
          ></InfoBox>
          <InfoBox
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths + " Total"}
          ></InfoBox>
        </div>

        <Map
          casesType={casesType}
          countries={mapCountires}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Live cases per day ratio graph by worldwide</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
