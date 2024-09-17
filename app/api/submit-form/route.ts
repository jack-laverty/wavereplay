import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Session } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const session: Session = await request.json();
    const supabase = createClient();

    console.log("SESSION:\n", session)
    
    const { data, error } = await supabase
      .from('sessions')  // Replace 'sessions' with your actual table name
      .insert([
        {
          session_id: 69,
          date: session.date,
          time: session.time,
          location: session.location,
          wave: session.wave,
          board: session.board,
        }
      ])
      .select();

    if (error) {
      console.error('Error appending to session:', error);
      return NextResponse.json({ error: 'Error appending to session', details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Catch all Error adding session:', error);
    return NextResponse.json({ error: 'Error adding session', details: error }, { status: 500 });
  }
}