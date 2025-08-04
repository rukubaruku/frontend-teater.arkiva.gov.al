import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CustomBarChart({ data, xKey, yKey, xLabel, yLabel }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getYAxisWidth = () => {
    if (windowWidth >= 1300) return 250;
    if (windowWidth >= 1080) return 200;
    if (windowWidth >= 880) return 180;
    if (windowWidth >= 680) return 150;
    return 120;
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={4} textAnchor="end" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{
              value: xLabel,

              offset: -5,
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            dataKey={yKey}
            type="category"
            width={getYAxisWidth()}
            interval={0}
            tick={<CustomYAxisTick />}
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="reservations" fill="#bd1e2c" name="Rezervime" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
