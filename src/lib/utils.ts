import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CreateItemForm, LoginForm, RegisterForm, SearchFilters } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLoginForm = (data: LoginForm): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!data.password.trim()) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (data: RegisterForm): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Invalid email address";
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateItemForm = (data: CreateItemForm): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "Item name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Item name must be at least 2 characters long";
  }

  if (!data.categoryId) {
    errors.categoryId = "Category is required";
  }

  if (!data.type) {
    errors.type = "Item type is required";
  }

  if (!data.unit.trim()) {
    errors.unit = "Unit is required";
  }

  if (data.quantity < 0) {
    errors.quantity = "Quantity cannot be negative";
  }

  if (data.unitCost < 0) {
    errors.unitCost = "Unit cost cannot be negative";
  }

  if (data.sellingPrice && data.sellingPrice < 0) {
    errors.sellingPrice = "Selling price cannot be negative";
  }

  if (data.reorderPoint < 0) {
    errors.reorderPoint = "Reorder point cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Formatting functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string, format = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: format as 'full' | 'long' | 'medium' | 'short',
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dateObj);
};

export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

// Inventory-specific functions
export const getStockStatus = (quantity: number, reorderPoint: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= reorderPoint) return 'low_stock';
  return 'in_stock';
};

export const getStockStatusColor = (status: 'in_stock' | 'low_stock' | 'out_of_stock'): string => {
  switch (status) {
    case 'in_stock': return 'text-green-600 bg-green-100';
    case 'low_stock': return 'text-yellow-600 bg-yellow-100';
    case 'out_of_stock': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const calculateInventoryValue = (quantity: number, unitCost: number): number => {
  return quantity * unitCost;
};

export const generateSKU = (name: string, category: string): string => {
  const namePrefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
  const categoryPrefix = category.replace(/[^a-zA-Z0-9]/g, '').substring(0, 2).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePrefix}${categoryPrefix}${randomSuffix}`;
};

export const generateBarcode = (): string => {
  return Math.random().toString(10).substring(2, 12);
};

// Search and filter functions
export const buildSearchQuery = (filters: SearchFilters): string => {
  const params = new URLSearchParams();

  if (filters.query) params.append('query', filters.query);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.type) params.append('type', filters.type);
  if (filters.status) params.append('status', filters.status);
  if (filters.minQuantity) params.append('minQuantity', filters.minQuantity.toString());
  if (filters.maxQuantity) params.append('maxQuantity', filters.maxQuantity.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  return params.toString();
};

export const filterInventory = (items: any[], filters: SearchFilters): any[] => {
  return items.filter(item => {
    // Search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.name.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.categoryId && item.category.id !== filters.categoryId) {
      return false;
    }

    // Type filter
    if (filters.type && item.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status) {
      const status = getStockStatus(item.quantity, item.reorderPoint);
      if (status !== filters.status) return false;
    }

    // Quantity range filter
    if (filters.minQuantity && item.quantity < filters.minQuantity) {
      return false;
    }
    if (filters.maxQuantity && item.quantity > filters.maxQuantity) {
      return false;
    }

    return true;
  });
};

export const sortInventory = (items: any[], sortBy: string, sortOrder: 'asc' | 'desc'): any[] => {
  return [...items].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle string comparison
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    // Handle nested objects
    if (sortBy === 'category' && aVal.name) {
      aVal = aVal.name.toLowerCase();
      bVal = bVal.name.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });
};

// API utility functions
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const createApiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Data transformation functions
export const transformInventoryForExport = (items: any[]): any[] => {
  return items.map(item => ({
    SKU: item.sku,
    Name: item.name,
    Description: item.description || '',
    Category: item.category.name,
    Type: item.type,
    Quantity: item.quantity,
    Unit: item.unit,
    'Unit Cost': formatCurrency(item.unitCost),
    'Total Value': formatCurrency(calculateInventoryValue(item.quantity, item.unitCost)),
    'Selling Price': item.sellingPrice ? formatCurrency(item.sellingPrice) : '',
    Supplier: item.supplier?.name || '',
    Location: item.location || '',
    'Reorder Point': item.reorderPoint,
    Status: getStockStatus(item.quantity, item.reorderPoint).replace('_', ' ').toUpperCase(),
    'Created Date': formatDate(item.createdAt),
    'Last Updated': formatDate(item.updatedAt),
  }));
};

export const transformTransactionsForExport = (transactions: any[]): any[] => {
  return transactions.map(transaction => ({
    ID: transaction.id,
    'Item SKU': transaction.item?.sku || '',
    'Item Name': transaction.item?.name || '',
    Type: transaction.type.toUpperCase(),
    Quantity: transaction.quantity,
    Reason: transaction.reason,
    'User': transaction.user?.name || '',
    'Date': formatDateTime(transaction.createdAt),
  }));
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};