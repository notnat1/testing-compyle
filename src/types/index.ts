// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

// Inventory item types
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: Category;
  type: 'product' | 'raw_material' | 'equipment';
  quantity: number;
  unit: string;
  unitCost: number;
  sellingPrice?: number;
  supplier?: Supplier;
  location?: string;
  reorderPoint: number;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  userId: string;
  createdAt: Date;
}

// Analytics types
export interface InventoryMetrics {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  recentTransactions: number;
  categoryDistribution: CategoryMetric[];
  inventoryTrend: TrendData[];
}

export interface CategoryMetric {
  category: string;
  count: number;
  value: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  totalItems: number;
  totalValue: number;
}

// Form types
export interface CreateItemForm {
  name: string;
  description?: string;
  categoryId: string;
  type: 'product' | 'raw_material' | 'equipment';
  quantity: number;
  unit: string;
  unitCost: number;
  sellingPrice?: number;
  supplierId?: string;
  location?: string;
  reorderPoint: number;
}

export interface UpdateItemForm extends Partial<CreateItemForm> {
  id: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'staff';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  type?: 'product' | 'raw_material' | 'equipment';
  status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  minQuantity?: number;
  maxQuantity?: number;
  sortBy?: 'name' | 'quantity' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Stock status
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

// UI Component Props types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  onRowClick?: (item: T) => void;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  roles?: ('admin' | 'staff')[];
}

// Toast notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

export interface PieChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[];
    borderWidth?: number;
  }[];
}

// Report types
export interface InventoryReport {
  id: string;
  title: string;
  type: 'inventory_value' | 'stock_movement' | 'low_stock' | 'category_analysis';
  dateRange: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  generatedBy: string;
  data: any;
}

// Settings types
export interface SystemSettings {
  companyName: string;
  currency: string;
  dateFormat: string;
  timezone: string;
  lowStockThreshold: number;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface UserSettings {
  id: string;
  userId: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  dashboardLayout: string;
}