import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { fetchWeeklyMeals, getRecentMeals } from '@/Action/searchFood.action';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
  userId: string | null;
  goalCalories: number;
}

const CaloriesGraph: React.FC<Props> = ({ userId, goalCalories }) => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);




  useEffect(() => {
    async function fetchData() {
      const data = await fetchWeeklyMeals(userId!);
       setWeeklyData(data); 
    }

    fetchData();
  }, [userId]);

  const dataForGraph = {
    labels: weeklyData.map(item => item.date),
    datasets: [
      {
        label: 'Calories Consumed',
        data: weeklyData.map(item => item.totalCalories),
        borderColor: 'rgb(17,24,39)',
        tension: 0.1,
      },
      {
        label: 'Goal Calories',
        data: Array(7).fill(goalCalories),
        borderColor: 'rgb(60, 179, 113) ',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  return (
    <div style={{  width: '90vw' }} className=' h-[400px] mt-4'>
    <Line 
      data={dataForGraph} 
      options={{ 
        responsive: true, 
        maintainAspectRatio: false 
      }} 
    />
  </div>
  );
};

export default CaloriesGraph;
