export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-slate-50/50">
      <div className="w-full max-w-110 bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}