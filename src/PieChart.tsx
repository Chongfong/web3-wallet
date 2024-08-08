import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';


type PieChartData = {
  label: string;
  value: number;
}

type PieChartProps = {
  data: PieChartData[];
  width?: string;
  height?: string;
}

const PieChartComponent = ({ data, width='300px', height='300px' }: PieChartProps) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
      },
    ],
  };

  return (
    <div style={{width, height}}>
      <Pie data={chartData}  />
    </div>
  );
};

export default PieChartComponent;
