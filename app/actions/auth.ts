"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/utils/supabase/server";
import { LoginSchema, SignupSchema } from "@/types/schemas/authSchema";
import { RateLimiter } from "limiter";

export type AuthActionState = { error?: string };

function firstZodError(err: unknown) {
  if (!err || typeof err !== "object") return "Invalid input";
  // ZodError has .issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issues = (err as any).issues as Array<{ message: string }> | undefined;
  return issues?.[0]?.message ?? "Invalid input";
}

const loginLimiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: "minute",
});
const signupLimiter = new RateLimiter({
  tokensPerInterval: 3,
  interval: "minute",
});

export async function signupAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!signupLimiter.tryRemoveTokens(1)) {
    return { error: "Too many signup attempts. Please try again later." };
  }

  const supabase = await createSupabaseServer();
  const { data: { user: activeUser } } = await supabase.auth.getUser();
  if (activeUser) {
    return { error: "You are already logged in with an active account." };
  }

  const raw = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };


  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) return { error: firstZodError(parsed.error) };
  // -------------------------

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  if (data.user && !data.session) {
    return { error: "Please check your email to verify your account before logging in." };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!loginLimiter.tryRemoveTokens(1)) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const raw = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: "Invalid email or password" };

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
