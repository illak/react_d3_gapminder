import { useEffect, useState } from "react";

const useData = () => {
  const [data, setData] = useState(null);

  console.log("[FETCH]: Fetching data...");

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/illak/" +
        "f8883a279717a784bfe97c5aa05e3d55/raw/" +
        "3c351e7a5370dd02955dd1a9838c56808a1e90a5/" +
        "gapminder.json"
    )
      .then(res => res.json())
      .then(data => {
        //Remove countries with null values
        const dataNoNull = data.map(o => ({
          countries: o.countries.filter(c => !Object.values(c).includes(null)),
          year: o.year
        }));
        setData(dataNoNull);
      })
      .catch(error => console.log(`[FETCH]: ${error}`));
  }, []);

  return data;
};

export default useData;
