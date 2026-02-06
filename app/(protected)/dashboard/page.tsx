import { createSupabaseServer } from "@/utils/supabase/server"
import { logoutAction } from "@/app/actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    // If there's no authenticated user, redirect to the login page
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-slate-900 underline decoration-indigo-500 decoration-2">SupaAuth</span>
          <form action={logoutAction}>
            <button className="text-sm px-1 py-1 rounded font-medium border border-red-500/30 text-slate-500 transition-colors hover:text-rose-600 hover:bg-rose-400/20">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg">
              {data.user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Welcome back!</h1>
              <p className="text-sm text-slate-500">{data.user?.email}</p>
            </div>
          </div>

          <div className="h-32 rounded-xl border-2 border-dashed border-slate-100 grid place-items-center text-slate-400 text-sm italic">
            Your project content goes here...
          </div>
        </div>
      </main>
    </div>
  )
}
