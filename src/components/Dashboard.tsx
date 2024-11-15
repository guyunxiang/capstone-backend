import React from 'react';
import { Box, Text, Link } from '@adminjs/design-system';
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
    <Box p={['lg']}>
      <Box mb="lg" flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">Dashboard</Text>
        <Link variant="primary" href="/api-docs">API DOCS</Link>
      </Box>
      <Box flex flexDirection={["column", "row"]} style={{ gap: 16 }}>
        <Box width={[1, 1 / 2, 1 / 3]} variant="card" flex flexDirection="column" alignItems="center" justifyContent="center">
          <Link href="/api-docs">
            <img src="/images/swagger_logo.svg" alt="Swagger API" width="100%" />
          </Link>
        </Box>
        <Box width={[1, 1 / 2, 1 / 3]}>
          <BookTypeDistributionChart data={data} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;