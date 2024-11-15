import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { Box } from '@adminjs/design-system'

interface Data {
  item: string;
  count: number;
  percent: number;
}

interface BookTypeDistributionChartProps {
  data: Data[];
}

const BookTypeDistributionChart: React.FC<BookTypeDistributionChartProps> = ({ data }) => {

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const chart = new Chart({
        width: 300,
        height: 300,
        container: 'container',
        autoFit: true,
      });

      chart.coordinate({ type: 'theta', outerRadius: 0.8 });

      chart
        .interval()
        .data(data)
        .transform({ type: 'stackY' })
        .encode('y', 'percent')
        .encode('color', 'item')
        .legend('color', { position: 'bottom', layout: { justifyContent: 'center' } })
        .label({
          position: 'outside',
          text: (data: Data) => `${data.item}: ${data.percent * 100}%`,
        })
        .tooltip((data) => ({
          name: data.item,
          value: `${data.percent * 100}%`,
        }));

      chart.render();
    } catch (error) {
      console.log(error)
    }
  }, [data, chartRef.current]);

  return (
    <Box variant="card">
      <div id="container" />
    </Box>
  );
};

export default BookTypeDistributionChart;