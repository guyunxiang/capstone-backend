import React from 'react';
import { Box, Text } from '@adminjs/design-system';
import BookTypeDistributionChart from './charts/BookTypeDistribution.js';

// mock data
const data = [
  { item: 'Book 1', count: 40, percent: 0.4 },
  { item: 'Book 2', count: 21, percent: 0.21 },
  { item: 'Book 3', count: 17, percent: 0.17 },
  { item: 'Book 4', count: 13, percent: 0.13 },
  { item: 'Book 5', count: 9, percent: 0.09 },
];

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb="xl">Dashboard</Text>
      <div>
        <BookTypeDistributionChart data={data} />
      </div>
    </Box>
  );
};

export default Dashboard;