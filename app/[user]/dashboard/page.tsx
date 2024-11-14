import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Session } from "@/lib/types"
import { createClient } from '@/lib/supabase/server'

async function getData(): Promise<Session[]> {

  const supabase = createClient();

  // REMOVE START
  // const { data: { session } } = await supabase.auth.getSession();
  // const token = session?.access_token;
  // console.log("JWT Token:", token);
  // REMOVE END

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
    <div className="container mx-auto py-6">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
