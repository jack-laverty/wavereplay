import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {

    const token = cookies().get('your_token_key')?.value;

    const { searchParams } = request.nextUrl;
    const videoId = searchParams.get('videoId');

    const response = await fetch(`${process.env.FASTAPI_SERVER_URL}/api/comments/${videoId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments from server');
    }

    const comments = await response.json();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

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