import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import type { MonthIncomeReportResponse } from '../../entities/Entities';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: true, position: 'top' },
    title: {
      display: true,
      text: 'Ingresos por categoría',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) =>
          typeof value === 'number' ? value.toLocaleString('es-AR') : value,
      },
    },
  },
};

function buildChartData(report: MonthIncomeReportResponse): ChartData<'bar'> {
  return {
    labels: ['Reservas', 'Membresías'],
    datasets: [
      {
        label: 'Ingresos',
        data: [report.monthIncomeActivities, report.monthIncomeMemberships],
        backgroundColor: ['#007bff', '#dc3545'],
      },
    ],
  };
}

export default function BarReportIncomeMonth({
  data,
}: {
  data: MonthIncomeReportResponse | null;
}) {
  if (!data) {
    return null;
  }

  return <Bar data={buildChartData(data)} options={options} />;
}
