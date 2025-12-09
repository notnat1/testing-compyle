import { NextRequest, NextResponse } from 'next/server';

// Mock inventory data
const mockInventory = [
  {
    id: '1',
    sku: 'LAP001',
    name: 'Laptop Model X1',
    description: 'High-performance laptop for office use',
    category: { id: '1', name: 'Electronics', color: '#3B82F6' },
    type: 'equipment',
    quantity: 15,
    unit: 'units',
    unitCost: 899.99,
    sellingPrice: 1299.99,
    supplier: { id: '1', name: 'Tech Supplies Inc' },
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
    category: { id: '2', name: 'Office Supplies', color: '#10B981' },
    type: 'product',
    quantity: 250,
    unit: 'reams',
    unitCost: 4.99,
    sellingPrice: 7.99,
    supplier: { id: '2', name: 'Office Depot' },
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
    category: { id: '1', name: 'Electronics', color: '#3B82F6' },
    type: 'product',
    quantity: 100,
    unit: 'pieces',
    unitCost: 3.99,
    sellingPrice: 9.99,
    supplier: { id: '1', name: 'Tech Supplies Inc' },
    location: 'Warehouse A',
    reorderPoint: 20,
    barcode: '3456789012',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    id: '4',
    sku: 'RAW001',
    name: 'Steel Sheets',
    description: 'Raw steel sheets for manufacturing',
    category: { id: '3', name: 'Raw Materials', color: '#F59E0B' },
    type: 'raw_material',
    quantity: 45,
    unit: 'sheets',
    unitCost: 45.00,
    supplier: { id: '3', name: 'Metal Works Co' },
    location: 'Factory Floor',
    reorderPoint: 10,
    barcode: '4567890123',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    id: '5',
    sku: 'DES001',
    name: 'Standing Desk',
    description: 'Adjustable standing desk with memory presets',
    category: { id: '4', name: 'Furniture', color: '#8B5CF6' },
    type: 'equipment',
    quantity: 8,
    unit: 'units',
    unitCost: 599.99,
    sellingPrice: 899.99,
    supplier: { id: '4', name: 'Office Furniture Plus' },
    location: 'Showroom',
    reorderPoint: 3,
    barcode: '5678901234',
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-12-06'),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = searchParams.get('query') || '';
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    let filteredInventory = [...mockInventory];

    // Apply filters
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredInventory = filteredInventory.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.sku.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.category.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (categoryId) {
      filteredInventory = filteredInventory.filter(item =>
        item.category.id === categoryId
      );
    }

    if (type) {
      filteredInventory = filteredInventory.filter(item =>
        item.type === type
      );
    }

    // Apply sorting
    filteredInventory.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];

      // Handle nested objects
      if (sortBy === 'category') {
        aVal = a.category.name;
        bVal = b.category.name;
      }

      // Handle dates
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
    });

    // Apply pagination
    const total = filteredInventory.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedInventory,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });

  } catch (error) {
    console.error('Inventory fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'categoryId', 'type', 'quantity', 'unit', 'unitCost'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new item
    const newItem = {
      id: (mockInventory.length + 1).toString(),
      sku: body.sku || `SKU${String(mockInventory.length + 1).padStart(3, '0')}`,
      name: body.name,
      description: body.description || '',
      category: { id: body.categoryId, name: 'Category', color: '#3B82F6' }, // Mock category
      type: body.type,
      quantity: parseInt(body.quantity),
      unit: body.unit,
      unitCost: parseFloat(body.unitCost),
      sellingPrice: body.sellingPrice ? parseFloat(body.sellingPrice) : undefined,
      supplier: body.supplierId ? { id: body.supplierId, name: 'Supplier' } : undefined,
      location: body.location,
      reorderPoint: body.reorderPoint || 0,
      barcode: body.barcode || `AUTO${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockInventory.push(newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Item created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Inventory creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}