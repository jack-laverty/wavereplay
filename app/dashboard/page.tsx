import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Session } from "@/lib/types"
import { createClient } from '@/lib/supabase/server'

async function getData(): Promise<Session[]> {

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

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
