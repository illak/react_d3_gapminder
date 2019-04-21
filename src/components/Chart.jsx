import React, { useState, useMemo, useCallback } from "react";
import * as d3 from "d3";

import useInterval from "../hooks/useInterval";
import styled from "styled-components";

const StyledCircle = styled.circle`
  transition: cx 0.1s, cy 0.1s, r 0.1s;
`;

const StyledText = styled.text`
  font: 500 90px "Helvetica Neue";
  fill: #ddd;
  cursor: pointer;

  &::after {
    content: "HOLA MUNDO";
    font: 500 90px "Helvetica Neue";
    fill: #ddd;
  }
`;

const Chart = ({ data, width, height, margin }) => {
  const [dataByIndex, setDataByIndex] = useState(data[0]);
  const [index, setIndex] = useState(1);
  const [stop, setStop] = useState(true);

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  useInterval(
    () => {
      if (index < data.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
      setDataByIndex(data[index]);
    },
    stop ? null : 100
  );

  // About useMemo: "This optimization helps to avoid
  // expensive calculations on every render."
  const color = useMemo(
    () =>
      d3
        .scaleOrdinal(d3.schemePastel1)
        .domain([...new Set(data[0].countries.map(c => c.continent))]),
    [data]
  );

  const x = useMemo(
    () =>
      d3
        .scaleLog()
        .domain([300, 150000])
        .range([0, chartWidth]),
    [chartWidth]
  );

  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 90])
        .range([chartHeight, 0]),
    [chartHeight]
  );

  const r = d3
    .scaleSqrt()
    .domain(d3.extent(dataByIndex.countries, c => c.population))
    .range([5, 30]);

  const bottomAxis = d3
    .axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));
  const addXAxis = useCallback(
    g => {
      d3.select(g).call(bottomAxis);
    },
    [bottomAxis]
  );

  const leftAxis = d3.axisLeft(y);
  const addYAxis = useCallback(
    g => {
      d3.select(g).call(leftAxis);
    },
    [leftAxis]
  );

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <StyledText x={0} y={70} onClick={() => setStop(!stop)}>
          {dataByIndex.year}
        </StyledText>
        {dataByIndex.countries.map(c => (
          <StyledCircle
            key={c.country}
            cx={x(c.income)}
            cy={y(c.life_exp)}
            r={r(c.population)}
            style={{ fill: `${color(c.continent)}`, stroke: "grey" }}
          />
        ))}
      </g>
      <g
        ref={addXAxis}
        transform={`translate(${margin.left}, ${chartHeight + margin.top})`}
      />
      <g
        ref={addYAxis}
        transform={`translate(${margin.left}, ${margin.top})`}
      />
      <text x={width / 2} y={height - 30} fontSize="20" textAnchor="middle">
        GPD Per Capita ($)
      </text>
      <text
        x={-height / 2}
        y={20}
        fontSize="20"
        textAnchor="middle"
        transform={`rotate(-90)`}
        style={{ textTransform: "capitalize" }}
      >
        Life Expentancy (Years)
      </text>
    </svg>
  );
};

export default Chart;
