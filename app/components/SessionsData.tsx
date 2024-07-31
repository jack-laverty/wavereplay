
import SessionsList from './SessionsList';
import { createClient } from '@/lib/supabase/server'

export default async function SessionsData() {
  
  const supabase = createClient();
  const { data: session_documents, error } = await supabase
  .from('sessions')
  .select('*')

  if (error) {
    console.error("Error fetching sessions:", error)
    return []
  }

  return <SessionsList sessions={session_documents} />;
}