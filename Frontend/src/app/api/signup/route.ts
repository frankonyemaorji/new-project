import { NextRequest, NextResponse } from "next/server";

// app/api/signup/route.ts

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API route called');
    
    const body = await request.json();
    console.log('Received signup data:', { ...body, password: '[HIDDEN]' });
    
    const { first_name, last_name, username, email, password, role = 'user' } = body;

    // Validate required fields
    if (!first_name || !last_name || !username || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('Calling backend API...');
    
    // Call your backend signup API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name,
        last_name,
        username,
        email,
        password,
        role
      }),
    });

    console.log('Backend response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Backend success response:', { ...data, password: '[HIDDEN]' });
      return NextResponse.json(data, { status: 201 });
    } else {
      const errorText = await response.text();
      console.log('Backend error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        return NextResponse.json(
          { error: 'Backend server error' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { error: errorData.detail || 'Signup failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}