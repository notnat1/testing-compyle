'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  BarChart3,
  Settings,
  Users,
  Tag,
  FileText,
  Menu,
  X,
  Plus,
  Home,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';

const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: 'inventory',
    label: 'Inventory',
    href: '/inventory',
    icon: <Package className="h-5 w-5" />,
  },
  {
    id: 'add-item',
    label: 'Add Item',
    href: '/inventory/add',
    icon: <Plus className="h-5 w-5" />,
  },
  {
    id: 'categories',
    label: 'Categories',
    href: '/categories',
    icon: <Tag className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin'],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole?: 'admin' | 'staff';
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, userRole = 'staff' }) => {
  const pathname = usePathname();

  const filteredNavigation = navigation.filter(item =>
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Inventory System
            </div>
          </div>
        </div>
      </div>
    </>
  );
};