
import SessionsList from './SessionsList';
import { createClient } from '@/lib/supabase/server'

const supabase = createClient();

export default async function SessionsData() {

    const { data: session_documents, error } = await supabase
    .from('sessions')
    .select('*')

  if (error) {
    console.error("Error fetching sessions:", error)
    return []
  }

  return <SessionsList sessions={session_documents} />;
}