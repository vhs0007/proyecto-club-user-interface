import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions,
  } from 'chart.js';
  import type { MonthIncomeReportResponse } from '../../entities/Entities';
  
  ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: {
        display: true,
        text: 'Ingresos mensuales',
      },
    },
    scales: {
      x: {
        title: {
            display: true,
            text: 'Meses',
        },
      },
      y: {
        title: {
            display: true,
            text: 'Ingresos',
        },
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            typeof value === 'number' ? value.toLocaleString('es-AR') : value,
        },
      },
    },
  };
  
  function buildChartData(data: MonthIncomeReportResponse[]): ChartData<'line'> {
    return {
      labels: data.map((month) =>
        new Date(month.month).toLocaleDateString('es-AR', { month: 'long' })
      ),
      datasets: [
        {
          label: 'Ingresos Membresias',
          data: data.map((month) => month.monthIncomeMemberships),
          borderColor: '#dc3545',
          backgroundColor: '#dc3545',
        },
        {
            label: 'Ingresos Reservas',
            data: data.map((month) => month.monthIncomeActivities),
            borderColor: '#ffc107',
            backgroundColor: '#ffc107',
        },
      ],
    };
  }

export default function LineReportMonthlyActivitiesMembership({ data }: { data: MonthIncomeReportResponse[] }) {
    return <Line options={options} data={buildChartData(data)} />;
}