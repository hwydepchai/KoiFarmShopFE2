/* eslint-disable no-unused-vars */
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  { name: 'Jan', uv: 400, pv: 2400 },
  { name: 'Feb', uv: 300, pv: 1398 },
  { name: 'Mar', uv: 200, pv: 9800 },
  { name: 'Apr', uv: 278, pv: 3908 },
  { name: 'May', uv: 189, pv: 4800 },
];

const DashboardContent = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardContent;
