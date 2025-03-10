import React, {useRef, useState, useEffect } from 'react';
import fakeData from '../../fakeDta/searchVolume.json';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';


ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);


const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];


export default function SearchVolumeChart({monthlySearches}) {
  const [labels, setLabels] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const year = monthlySearches[0]?.year;
  const months2024 = monthlySearches.filter((d) => d.year === 2024 )
  useEffect(() => {
    const newData  =  months2024?.map((f) => {  
      const data = {}
      data[monthsOfYear[f.month - 1]] = f.search_volume
      return data
    });
    const dataValues = monthsOfYear?.map((e) => {
        let searchv;
        newData.map((item) => {
          if (Object.keys(item)[0] === e) {
              searchv = item[e];
          }
        });
        return searchv;
    });
    setLabels(monthsOfYear);
    setSearchedData(dataValues);

  }, [monthlySearches]); 

  const data = {
      labels,
       datasets: [
        {
          label: 'Search Volume',
          data: searchedData, // Search volume values
          borderColor: 'rgba(75, 192, 192, 1)', // Line color
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color under the line
          pointBackgroundColor: 'transparent', // Remove point color by setting it to transparent
          pointRadius: 0, // Remove points completely by setting radius to 0
          pointHoverRadius: 0, // Remove hover effect on points
          borderWidth: 3, // Thicker line
          fill: true, // Fill the area under the line
        },
      ],
  };


  return (
    <div className='w-[900px]  py-3'>
      <h2>Search Volume for {year}</h2>
      <Line data={data} /> 
    </div>
  );
}
