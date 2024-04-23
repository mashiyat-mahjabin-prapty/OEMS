import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import {
    ResponsiveContainer,
  } from 'recharts';



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

export default function PieChartWithCenterLabel(SummaryEntries, count1) {
  let data = [];
  React.useEffect(() => {
    // console.log('Summary Entries:', SummaryEntries);
    // console.log('Count:', count1);
    // set Attended as summaryentries.length
    // set absent as count - summaryentries.length

    data = [
      { value: SummaryEntries.length, label: 'Attended' },
      { value: count1-SummaryEntries.length, label: 'Absent' },
    ]
    

    
  }, []);
  return (
    <ResponsiveContainer width="100%" height={400}>
    <PieChart series={[{ data, innerRadius:110}]} {...size}>
      <PieCenterLabel>Exam Name</PieCenterLabel>
    </PieChart>
    </ResponsiveContainer>
  );
}