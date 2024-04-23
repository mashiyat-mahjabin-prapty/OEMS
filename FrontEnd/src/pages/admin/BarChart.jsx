import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  BarChart,
  Bar, // Replace Line with Bar
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
export default function StudentBarChart() {
  // Calculate the mark range size based on the total marks
  const markRangeSize = 100 / 5; // Divide into 5 equal ranges
  const data = [
    {
      stu_id: '1',
      name: 'Student 1',
      marks: 45,
    },
    {
      stu_id: '2',
      name: 'Student 2',
      marks: 78,
    },
    {
      stu_id: '3',
      name: 'Student 3',
      marks: 65,
    },
    {
      stu_id: '4',
      name: 'Student 4',
      marks: 65,
    },
    {
      stu_id: '5',
      name: 'Student 5',
      marks: 88,
    },
    {
      stu_id: '6',
      name: 'Student 6',
      marks: 75,
    },
    {
      stu_id: '7',
      name: 'Student 7',
      marks: 95,
    },
  ];

  // Calculate mark range start and end values
  const markRangeCounts = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    end: (i + 1) * markRangeSize,
    student: data.filter(
      (student) =>
        student.marks >= i * markRangeSize &&
        student.marks < (i + 1) * markRangeSize
    ).length,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={markRangeCounts}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="end" type="number" label={{ value: 'Marks', position: 'left' }} />
          <YAxis label={{ value: 'Number of Students', angle: -90, position: 'center' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="student" fill="#60324b" /> 
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
