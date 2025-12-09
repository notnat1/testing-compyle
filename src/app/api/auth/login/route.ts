import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/utils';

// Mock user database - in a real app, this would be a database
const users = [
  {
    id: '1',
    email: 'admin@demo.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'staff@demo.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Staff User',
    role: 'staff',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token (in a real app, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}