import Link from "next/link"
import { AuthCard } from "@/auth/AuthCard"
import { AuthForm } from "@/forms/authForm"
import { signupAction } from "@/app/actions/auth"

export default function SignupPage() {
    return (
        <AuthCard title="Signup" subtitle="Create a new account.">
            <AuthForm action={signupAction} showConfirm submitLabel="Create account" submitLoadingLabel="Creating..." />

            <p className="mt-4 text-sm text-gray-600">
                Already have an account? <Link className="underline" href="/login">Sign in</Link>
            </p>
        </AuthCard>
    )
}
