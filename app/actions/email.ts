"use server";

import { createSupabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function sendVerificationEmail(email: string) {
  const supabase = await createSupabaseServer();
  

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send verification email.");
  }
}

export async function resetPassword(email: string) {
  const supabase = await createSupabaseServer();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard/update-password`,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send password reset email.");
  }

  redirect("/login");
}