'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { Button, Card, Badge, Table, TableColumn } from '@/components/ui';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, getStockStatus, getStockStatusColor } from '@/lib/utils';
import { InventoryItem } from '@/types';

interface InventoryResponse {
  data: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<any>(null);

  // Mock categories
  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Office Supplies' },
    { id: '3', name: 'Raw Materials' },
    { id: '4', name: 'Furniture' },
  ];

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

    fetchInventory();
  }, [router]);

  useEffect(() => {
    fetchInventory();
  }, [searchQuery, selectedCategory, selectedType, currentPage]);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (searchQuery) params.append('query', searchQuery);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedType) params.append('type', selectedType);
      params.append('sortBy', 'name');
      params.append('sortOrder', 'asc');

      const response = await fetch(`/api/inventory?${params}`);
      const data: InventoryResponse = await response.json();

      if (response.ok) {
        setItems(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error('Failed to fetch inventory:', data);
        // Use mock data if API fails
        setItems(getMockInventoryData());
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Use mock data if API fails
      setItems(getMockInventoryData());
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getMockInventoryData = (): InventoryItem[] => [
    {
      id: '1',
      sku: 'LAP001',
      name: 'Laptop Model X1',
      description: 'High-performance laptop for office use',
      category: { id: '1', name: 'Electronics', color: '#3B82F6', createdAt: new Date() },
      type: 'equipment',
      quantity: 15,
      unit: 'units',
      unitCost: 899.99,
      sellingPrice: 1299.99,
      supplier: { id: '1', name: 'Tech Supplies Inc', createdAt: new Date() },
      location: 'Warehouse A',
      reorderPoint: 5,
      barcode: '1234567890',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01'),
    },
    {
      id: '2',
      sku: 'PAP001',
      name: 'Office Paper A4',
      description: 'Standard office paper',
      category: { id: '2', name: 'Office Supplies', color: '#10B981', createdAt: new Date() },
      type: 'product',
      quantity: 250,
      unit: 'reams',
      unitCost: 4.99,
      sellingPrice: 7.99,
      supplier: { id: '2', name: 'Office Depot', createdAt: new Date() },
      location: 'Storage Room B',
      reorderPoint: 50,
      barcode: '2345678901',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-11-28'),
    },
    {
      id: '3',
      sku: 'CAB001',
      name: 'Ethernet Cable',
      description: 'Cat6 Ethernet cable 10ft',
      category: { id: '1', name: 'Electronics', color: '#3B82F6', createdAt: new Date() },
      type: 'product',
      quantity: 100,
      unit: 'pieces',
      unitCost: 3.99,
      sellingPrice: 9.99,
      supplier: { id: '1', name: 'Tech Supplies Inc', createdAt: new Date() },
      location: 'Warehouse A',
      reorderPoint: 20,
      barcode: '3456789012',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-12-05'),
    },
  ];

  const columns: TableColumn<InventoryItem>[] = [
    {
      key: 'sku',
      label: 'SKU',
      render: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'name',
      label: 'Item Name',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {item.description && (
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {item.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.category.color }}
          />
          <span className="text-sm text-gray-600">{item.category.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <Badge variant="info">
          {value?.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      label: 'Stock Level',
      render: (value, item) => {
        const status = getStockStatus(item.quantity, item.reorderPoint);
        const colorClass = getStockStatusColor(status);
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{value} {item.unit}</span>
            <Badge variant={status === 'in_stock' ? 'success' : status === 'low_stock' ? 'warning' : 'error'}>
              {status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'unitCost',
      label: 'Unit Cost',
      render: (value) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value) => (
        <span className="text-sm text-gray-600">{value || 'Not specified'}</span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  };

  return (
    <Layout
      userName={user?.name || 'Admin User'}
      userRole={user?.role || 'admin'}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your inventory items
            </p>
          </div>
          <Button variant="primary" onClick={() => router.push('/inventory/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="product">Products</option>
                <option value="raw_material">Raw Materials</option>
                <option value="equipment">Equipment</option>
              </select>

              {/* Export Button */}
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <Card>
          <Table
            data={items}
            columns={columns}
            loading={loading}
            onRowClick={(item) => router.push(`/inventory/${item.id}`)}
          />
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}