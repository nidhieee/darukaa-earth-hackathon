import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SiteChart({ analytics }) {
  if (!analytics || analytics.length === 0) {
    return <p>No analytics data available for this site yet.</p>;
  }

  const labels = analytics.map(a => new Date(a.recorded_at).toLocaleDateString());
  const carbonData = analytics.map(a => a.carbon_tons);
  const bioData = analytics.map(a => a.biodiversity_index);

  const data = {
    labels,
    datasets: [
      {
        label: 'Carbon Est. (tons)',
        data: carbonData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Biodiversity Index',
        data: bioData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <div className="chart-container"><Line options={options} data={data} /></div>;
}
