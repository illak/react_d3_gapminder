import React from "react";

import Chart from "../components/Chart";

const ChartContainer = ({ data }) => {
  const margin = { top: 20, left: 80, right: 20, bottom: 80 };

  return data ? (
    <Chart data={data} width={800} height={500} margin={margin}>
      App
    </Chart>
  ) : (
    <div className="ui segment" style={{ height: "100%" }}>
      <div className="ui active inverted dimmer">
        <div className="ui large text loader">Loading data...</div>
      </div>
      <p />
    </div>
  );
};

export default ChartContainer;
