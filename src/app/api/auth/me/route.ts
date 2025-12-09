import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const users = [
  {
    id: '1',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'staff@demo.com',
    name: 'Staff User',
    role: 'staff',
  },
];

function getUserFromToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    return users.find(u => u.id === userId);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);
    const user = getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}