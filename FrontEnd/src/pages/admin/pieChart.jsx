import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import {
    ResponsiveContainer,
  } from 'recharts';

const data = [
  { value: 100, label: 'Passed' },
  { value: 50, label: 'Failed' },
  { value: 15, label: 'Absent' },

];

const size = {
  width: 500,
  height: 400,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
   
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
    
  );
}

export default function PieChartWithCenterLabel() {
  return (
    <ResponsiveContainer width="100%" height={400}>
    <PieChart series={[{ data, innerRadius:110}]} {...size}>
      <PieCenterLabel>Exam Name</PieCenterLabel>
    </PieChart>
    </ResponsiveContainer>
  );
}