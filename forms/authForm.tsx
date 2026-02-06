"use client"
import { useActionState, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import type { AuthActionState } from "@/app/actions/auth"

function SubmitButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 active:scale-[0.98]"
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {loadingLabel}
                </span>
            ) : label}
        </button>
    )
}

function PasswordStrength({ value }: { value: string }) {
    if (!value) return null
    const score = [/[A-Z]/, /[a-z]/, /[0-9]/, /[@$!%*?&#]/].reduce((s, r) => (r.test(value) ? s + 1 : s), 0)
    const percent = Math.min(100, (score / 4) * 100)
    const color = score <= 1 ? "bg-rose-500" : score === 2 ? "bg-amber-500" : "bg-emerald-500"

    return (
        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }} />
            </div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1.5">Security Level</p>
        </div>
    )
}

export function AuthForm({ action, submitLabel, submitLoadingLabel, showConfirm = false }: any) {
    // Hooks re-added here
    const [state, formAction] = useActionState<AuthActionState, FormData>(action, {})
    const formRef = useRef<HTMLFormElement | null>(null)
    const [localError, setLocalError] = useState<string | null>(null)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [passwordValue, setPasswordValue] = useState("")

    const inputClasses = "w-full rounded-lg border border-slate-200 bg-slate-50/30 px-3.5 py-2 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"

    return (
        <form ref={formRef} onSubmit={() => setLocalError(null)} action={formAction} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1" htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" className={inputClasses} placeholder="name@company.com" required />
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="password">Password</label>
                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                        {passwordVisible ? "Hide" : "Show"}
                    </button>
                </div>
                <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    className={inputClasses}
                    placeholder="••••••••"
                    required
                    onChange={(e) => setPasswordValue(e.target.value)}
                />
                {showConfirm && <PasswordStrength value={passwordValue} />}
            </div>

            {showConfirm && (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" name="confirmPassword" type={passwordVisible ? "text" : "password"} className={inputClasses} placeholder="••••••••" required />
                </div>
            )}

            {(state?.error || localError) && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-xs font-medium text-rose-600 animate-in shake-1">
                    {localError ?? state.error}
                </div>
            )}

            <SubmitButton label={submitLabel} loadingLabel={submitLoadingLabel} />
        </form>
    )
}