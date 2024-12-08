import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Session } from "@/lib/types"
import { createClient } from '@/lib/supabase/server'

async function getSessions(): Promise<Session[]> {

  const supabase = createClient();

  const { data: sessions, error } = await supabase
  .from('sessions')
  .select('*')

  if (error) {
    console.error("Error fetching sessions:", error)
    return []
  }

  return sessions
}

export default async function Dashboard() {
  const data = await getSessions()

  return (
    <div className="m-6">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
