'use client';

import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

interface StatsCardsProps {
  data: {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    recentTransactions: number;
  };
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data, loading = false }) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    recentTransactions: 0,
  });

  useEffect(() => {
    if (loading) return;

    const duration = 1000;
    const steps = 20;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        totalItems: Math.floor(data.totalItems * progress),
        totalValue: Math.floor(data.totalValue * progress),
        lowStockItems: Math.floor(data.lowStockItems * progress),
        recentTransactions: Math.floor(data.recentTransactions * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({
          totalItems: data.totalItems,
          totalValue: data.totalValue,
          lowStockItems: data.lowStockItems,
          recentTransactions: data.recentTransactions,
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [data, loading]);

  const cards: StatsCard[] = [
    {
      title: 'Total Items',
      value: formatNumber(animatedValues.totalItems),
      icon: <Package className="h-6 w-6" />,
      color: 'blue',
      trend: {
        value: 12,
        isPositive: true,
      },
    },
    {
      title: 'Total Value',
      value: formatCurrency(animatedValues.totalValue),
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'green',
      trend: {
        value: 8,
        isPositive: true,
      },
    },
    {
      title: 'Low Stock Items',
      value: formatNumber(animatedValues.lowStockItems),
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'yellow',
      trend: {
        value: 3,
        isPositive: false,
      },
    },
    {
      title: 'Recent Transactions',
      value: formatNumber(animatedValues.recentTransactions),
      icon: <Activity className="h-6 w-6" />,
      color: 'purple',
      trend: {
        value: 15,
        isPositive: true,
      },
    },
  ];

  const getColorClasses = (color: 'blue' | 'green' | 'yellow' | 'purple') => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        trend: 'text-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        trend: 'text-green-600',
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        trend: 'text-yellow-600',
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        trend: 'text-purple-600',
      },
    };
    return colors[color];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.trend && (
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${colors.trend}`}>
                      {card.trend.isPositive ? '+' : ''}{card.trend}%
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <div className={colors.icon}>{card.icon}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};