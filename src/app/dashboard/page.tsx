'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { InventoryChart } from '@/components/Dashboard/InventoryChart';
import { CategoryChart } from '@/components/Dashboard/CategoryChart';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { InventoryMetrics, TrendData, CategoryMetric } from '@/types';

// Mock data for demonstration - replace with API calls
const mockMetrics: InventoryMetrics = {
  totalItems: 1247,
  totalValue: 89654,
  lowStockItems: 23,
  recentTransactions: 45,
  categoryDistribution: [
    { category: 'Electronics', count: 342, value: 45678, percentage: 27.4 },
    { category: 'Raw Materials', count: 256, value: 12345, percentage: 20.5 },
    { category: 'Office Supplies', count: 189, value: 5678, percentage: 15.2 },
    { category: 'Equipment', count: 156, value: 23456, percentage: 12.5 },
    { category: 'Packaging', count: 134, value: 3456, percentage: 10.7 },
    { category: 'Other', count: 170, value: 8921, percentage: 13.7 },
  ],
  inventoryTrend: generateMockTrendData(),
};

function generateMockTrendData(): TrendData[] {
  const data: TrendData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const baseItems = 1200 + Math.floor(Math.random() * 100);
    const baseValue = 85000 + Math.floor(Math.random() * 5000);

    data.push({
      date: date.toISOString(),
      totalItems: baseItems + i,
      totalValue: baseValue + (i * 100),
    });
  }

  return data;
}

const mockTransactions = [
  {
    id: '1',
    type: 'in' as const,
    itemName: 'Laptop Model X1',
    quantity: 10,
    reason: 'New stock received',
    userName: 'John Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '2',
    type: 'out' as const,
    itemName: 'Office Paper A4',
    quantity: 5,
    reason: 'Used for marketing materials',
    userName: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '3',
    type: 'adjustment' as const,
    itemName: 'USB-C Cables',
    quantity: 3,
    reason: 'Stock count correction',
    userName: 'Mike Davis',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '4',
    type: 'in' as const,
    itemName: 'Standing Desks',
    quantity: 2,
    reason: 'New office furniture',
    userName: 'John Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: '5',
    type: 'out' as const,
    itemName: 'Monitor 27"',
    quantity: 1,
    reason: 'Equipment replacement',
    userName: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<InventoryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, this would be an API call
        // const response = await fetch('/api/dashboard/metrics');
        // const data = await response.json();

        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      userName={user?.name || 'Admin User'}
      userRole={user?.role || 'admin'}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's an overview of your inventory.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards
          data={{
            totalItems: metrics?.totalItems || 0,
            totalValue: metrics?.totalValue || 0,
            lowStockItems: metrics?.lowStockItems || 0,
            recentTransactions: metrics?.recentTransactions || 0,
          }}
          loading={loading}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryChart
            data={metrics?.inventoryTrend || []}
            loading={loading}
          />
          <CategoryChart
            data={metrics?.categoryDistribution || []}
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <RecentActivity
          data={mockTransactions}
          loading={loading}
        />
      </div>
    </Layout>
  );
}