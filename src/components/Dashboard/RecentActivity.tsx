'use client';

import React from 'react';
import { Package, TrendingUp, TrendingDown, Edit3 } from 'lucide-react';
import { Card, Badge, Table, TableColumn } from '@/components/ui';
import { formatDateTime } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'in' | 'out' | 'adjustment';
  itemName: string;
  quantity: number;
  reason: string;
  userName: string;
  createdAt: Date;
}

interface RecentActivityProps {
  data: Transaction[];
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ data, loading = false }) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'adjustment':
        return <Edit3 className="h-4 w-4 text-blue-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'in':
        return <Badge variant="success">IN</Badge>;
      case 'out':
        return <Badge variant="error">OUT</Badge>;
      case 'adjustment':
        return <Badge variant="info">ADJ</Badge>;
      default:
        return <Badge variant="info">{type}</Badge>;
    }
  };

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'type',
      label: 'Type',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          {getTransactionIcon(item.type)}
          {getTransactionBadge(item.type)}
        </div>
      ),
    },
    {
      key: 'itemName',
      label: 'Item',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value, item) => {
        const sign = item.type === 'out' ? '-' : '+';
        return (
          <span className={`font-mono font-medium ${
            item.type === 'out' ? 'text-red-600' : 'text-green-600'
          }`}>
            {sign}{Math.abs(value)}
          </span>
        );
      },
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value) => (
        <span className="text-sm text-gray-600 max-w-xs truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: 'userName',
      label: 'User',
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(value)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="animate-pulse">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Inventory transactions will appear here</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all transactions
          </button>
        </div>
        <Table
          data={data}
          columns={columns}
          loading={loading}
          onRowClick={() => {}} // Can add navigation to transaction details
        />
      </div>
    </Card>
  );
};