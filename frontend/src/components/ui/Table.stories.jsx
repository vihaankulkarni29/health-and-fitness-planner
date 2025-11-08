import React from 'react';
import Table from './Table';

export default {
  title: 'UI/Table',
  component: Table,
};

const sampleColumns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  { id: 'date', label: 'Date', minWidth: 120, align: 'right' },
];

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', date: '2025-11-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', date: '2025-11-05' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', date: '2025-10-28' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Active', date: '2025-11-08' },
];

export const Basic = () => (
  <Table columns={sampleColumns} data={sampleData} />
);

export const WithCustomRender = () => {
  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 100,
      render: (row) => (
        <span style={{ 
          padding: '4px 12px', 
          borderRadius: '12px', 
          backgroundColor: row.status === 'Active' ? '#e8f5e9' : '#ffebee',
          color: row.status === 'Active' ? '#2e7d32' : '#c62828',
          fontSize: '13px',
          fontWeight: 500
        }}>
          {row.status}
        </span>
      )
    },
    { id: 'date', label: 'Date', minWidth: 120 },
  ];

  return <Table columns={columns} data={sampleData} />;
};

export const Empty = () => (
  <Table 
    columns={sampleColumns} 
    data={[]} 
    emptyMessage="No data available"
  />
);
