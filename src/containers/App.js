import React from "react";

import useData from "../hooks/useData";

import ChartContainer from "./ChartContainer";

const App = props => {
  const data = useData();

  return <ChartContainer data={data} />;
};

export default App;
