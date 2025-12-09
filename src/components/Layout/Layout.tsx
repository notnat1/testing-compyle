'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'staff';
  userName?: string;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  userRole = 'staff',
  userName = 'Admin User',
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
      />

      <div className="lg:ml-64">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={userName}
          onLogout={onLogout}
        />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};