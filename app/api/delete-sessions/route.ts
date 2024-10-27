import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();

  try {
    // Parse the request body to get the IDs of the rows to delete
    const { ids } = await request.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No row IDs provided' }, { status: 400 });
    }

    // Step 1: Delete the selected rows from the database
    const { data, error } = await supabase
      .from('sessions')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({ success: true, deletedIds: ids });

  } catch (error) {
    console.error('Error deleting rows:', error);
    return NextResponse.json(
      { error: 'Error deleting rows', details: error },
      { status: 500 }
    );
  }
}
