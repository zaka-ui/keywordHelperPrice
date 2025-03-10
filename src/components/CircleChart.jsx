import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CircleChart({ keywordDifficulty }) {
  // Define competition labels
  const competition = ['Très facile', 'Facile', 'Concurentiel', 'Très concurentiel'];

  // Determine the competition label based on `keywordDifficulty`
  const difficultyLabel =
    keywordDifficulty < 50
      ? competition[0]
      : keywordDifficulty >= 50 && keywordDifficulty < 100
      ? competition[1]
      : keywordDifficulty >= 100 && keywordDifficulty < 150
      ? competition[2]
      : competition[3];

  // Convert competition to a percentage scale for the chart
  const difficultyValue = 
    keywordDifficulty < 50
      ? 5
      : keywordDifficulty >= 50 && keywordDifficulty < 100
      ? 10
      : keywordDifficulty >= 100 && keywordDifficulty < 150
      ? 75
      : 100;

  // Chart data
  const data = {
    labels: ['Difficulty score', 'Easy score'], 
    datasets: [
      {
        data: [difficultyValue, 100 - difficultyValue],
        backgroundColor: ['#732E00', 'green'],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    cutout: '50%',
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className='w-[250px] h-[250px] text-center'>
      <h2 className="text-lg font-semibold">Keyword Difficulty</h2>
      <Doughnut data={data} options={options} />
      <div className="mt-2">
        <span className="text-sm font-medium">{difficultyLabel}</span>
      </div>
    </div>
  );
}
