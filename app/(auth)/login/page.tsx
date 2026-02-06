import Link from "next/link"
import { AuthCard } from "@/auth/AuthCard"
import { AuthForm } from "@/forms/authForm"
import { loginAction } from "@/app/actions/auth"

export default function LoginPage() {
    return (
        <AuthCard title="Login" subtitle="Sign in with email & password.">
            <AuthForm action={loginAction} submitLabel="Sign in" submitLoadingLabel="Signing in..." />

            <p className="mt-4 text-sm text-gray-600">
                Don&apos;t have an account? <Link className="underline" href="/signup">Create one</Link>
            </p>
        </AuthCard>
    )
}
