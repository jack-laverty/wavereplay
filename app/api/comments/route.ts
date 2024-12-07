import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.FASTAPI_SERVER_URL}/api/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment on server');
    }

    const newComment = await response.json();
    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}