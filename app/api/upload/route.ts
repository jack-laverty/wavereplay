import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { Video } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { video: Video } }
) {
  try {
    console.error('Function not implemented');
    return NextResponse.json({ error: 'Function not implemented'}, { status: 500 });
  } catch (error) {
    console.error('Catch all Error streaming video:', error);
    return NextResponse.json({ error: 'Error streaming video', details: error }, { status: 500 });
  }
}